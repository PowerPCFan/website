<script lang="ts">
    import { tick } from "svelte";
    import Title from "$lib/components/title.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Holder from "$lib/components/Holder.svelte";

    type ItemInput = {
        id: number;
        label: string;
        amount: string;
    };

    type ScaledItem = {
        label: string;
        originalCents: number;
        scaledCents: number;
    };

    type ParsedRow = ItemInput & {
        amountCents: number | null;
        isAmountValid: boolean;
        hasAmount: boolean;
        outputLabel: string;
    };

    type SourceItem = {
        label: string;
        cents: number;
    };

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    let totalInput = $state("");
    let items = $state<ItemInput[]>([{ id: 1, label: "", amount: "" }]);
    let nextId = $state(2);

    const totalCents = $derived(parseCurrencyToCents(totalInput));

    const parsedRows = $derived.by((): ParsedRow[] => {
        let includedIndex = 0;
        return items.map((item) => {
            const trimmedAmount = item.amount.trim();
            if (!trimmedAmount) {
                return {
                    ...item,
                    amountCents: null as number | null,
                    isAmountValid: true,
                    hasAmount: false,
                    outputLabel: "",
                };
            }

            const parsedAmount = parseCurrencyToCents(trimmedAmount);
            const isAmountValid = parsedAmount !== null && parsedAmount >= 0;
            if (isAmountValid) {
                includedIndex += 1;
            }

            return {
                ...item,
                amountCents: parsedAmount,
                isAmountValid,
                hasAmount: true,
                outputLabel: item.label.trim() || `Item #${includedIndex}`,
            };
        });
    });

    const invalidAmountCount = $derived(parsedRows.filter((row: ParsedRow) => row.hasAmount && !row.isAmountValid).length);

    const sourceItems = $derived.by((): SourceItem[] => {
        return parsedRows.filter((row: ParsedRow) =>
            row.hasAmount && row.isAmountValid && row.amountCents !== null
        ).map((row: ParsedRow) => ({
            label: row.outputLabel,
            cents: row.amountCents as number
        }));
    });

    const sourceSubtotalCents = $derived(sourceItems.reduce((sum, item) => sum + item.cents, 0));
    const canScale = $derived(totalCents !== null && totalCents > 0 && invalidAmountCount === 0 && sourceItems.length > 0 && sourceSubtotalCents > 0);

    const scaledBreakdown = $derived.by(() => {
        if (!canScale || totalCents === null) {
            return [] as ScaledItem[];
        }

        const allocations = scaleCents(
            totalCents,
            sourceItems.map((item) => item.cents),
        );

        return sourceItems.map((item, index) => ({
            label: item.label,
            originalCents: item.cents,
            scaledCents: allocations[index],
        }));
    });

    const scaledSubtotalCents = $derived(
        scaledBreakdown.reduce((sum, item) => sum + item.scaledCents, 0),
    );

    const scaleFactor = $derived(
        canScale && totalCents !== null && sourceSubtotalCents > 0
            ? totalCents / sourceSubtotalCents
            : null,
    );

    function setTotalInput(value: string) {
        totalInput = normalizeCurrencyInput(value);
    }

    function setItemAmount(index: number, value: string) {
        if (!items[index]) { return }
        items[index].amount = normalizeCurrencyInput(value);
    }

    function normalizeCurrencyInput(value: string): string {
        let cleaned = value.replace(/[^\d.,]/g, "");
        if (!cleaned) { return "" }
        cleaned = cleaned.replace(/[.,]{2,}/g, (match) => match[0]);
        return (cleaned.startsWith(".") || cleaned.startsWith(",")) ? `0${cleaned}` : cleaned;
    }

    function parseCurrencyToCents(value: string): number | null {
        const sanitized = value.replace(/[^\d.,]/g, "").trim();
        if (!sanitized) {
            return null;
        }

        const lastDot = sanitized.lastIndexOf(".");
        const lastComma = sanitized.lastIndexOf(",");
        const decimalIndex = Math.max(lastDot, lastComma);

        let integerPart = sanitized;
        let fractionalPart = "";

        if (decimalIndex !== -1) {
            const rightSide = sanitized.slice(decimalIndex + 1).replace(/[.,]/g, "");
            if (rightSide.length > 0 && rightSide.length <= 2) {
                integerPart = sanitized.slice(0, decimalIndex);
                fractionalPart = rightSide;
            }
        }

        const integerDigits = integerPart.replace(/[.,]/g, "");
        if (!integerDigits && !fractionalPart) {
            return null;
        }

        const whole = integerDigits ? Number(integerDigits) : 0;
        if (!Number.isFinite(whole)) {
            return null;
        }

        const cents = fractionalPart
            ? Number(fractionalPart.padEnd(2, "0").slice(0, 2))
            : 0;

        if (!Number.isFinite(cents)) {
            return null;
        }

        return whole * 100 + cents;
    }

    function formatCents(cents: number): string {
        return currencyFormatter.format(cents / 100);
    }

    function scaleCents(targetTotal: number, sourceValues: number[]): number[] {
        const sourceSum = sourceValues.reduce((sum, value) => sum + value, 0);
        const rawAllocations = sourceValues.map((value) => (value / sourceSum) * targetTotal);
        const floored = rawAllocations.map((value) => Math.floor(value));

        let remainder = targetTotal - floored.reduce((sum, value) => sum + value, 0);

        const rankedFractionalParts = rawAllocations
            .map((value, index) => ({
                index,
                fraction: value - floored[index],
            }))
            .sort((a, b) => {
                if (b.fraction !== a.fraction) {
                    return b.fraction - a.fraction;
                }
                return a.index - b.index;
            });

        for (let i = 0; i < remainder; i += 1) {
            floored[rankedFractionalParts[i % rankedFractionalParts.length].index] += 1;
        }

        return floored;
    }

    function focusItemField(itemId: number, field: "label" | "amount") {
        const selector = `input[data-item-id="${itemId}"][data-item-field="${field}"]`;
        const input = document.querySelector<HTMLInputElement>(selector);
        if (input) {
            input.focus();
        }
    }

    function handleFieldKeydown(event: KeyboardEvent, index: number, field: "label" | "amount") {
        const input = event.target as HTMLInputElement;

        if (event.key.toLowerCase() === "escape") {
            input.blur();
            return;
        }

        if (event.key.toLowerCase() === "tab") {
            event.preventDefault();
            const isShift = event.shiftKey;
            if (!isShift) {
                if (field === "label") {
                    focusItemField(items[index].id, "amount");
                } else {
                    if (index < items.length - 1) {
                        focusItemField(items[index + 1].id, "label");
                    } else {
                        const newId = addRow();
                        tick().then(() => focusItemField(newId, "label"));
                    }
                }
            } else {
                if (field === "amount") {
                    focusItemField(items[index].id, "label");
                } else {
                    if (index > 0) {
                        focusItemField(items[index - 1].id, "amount");
                    }
                }
            }
            return;
        }

        if (event.key.toLowerCase() === "arrowleft" && field === "amount" && input.selectionStart === 0 && input.selectionEnd === 0) {
            event.preventDefault();
            focusItemField(items[index].id, "label");
            return;
        }
        if (event.key.toLowerCase() === "arrowright" && field === "label" && input.selectionStart === input.value.length && input.selectionEnd === input.value.length) {
            event.preventDefault();
            focusItemField(items[index].id, "amount");
            return;
        }

        if (event.key.toLowerCase() === "arrowup") {
            event.preventDefault();
            if (field === "amount" && index > 0) {
                focusItemField(items[index - 1].id, "amount");
            } else if (field === "label" && index > 0) {
                focusItemField(items[index - 1].id, "label");
            }
            return;
        }
        if (event.key.toLowerCase() === "arrowdown") {
            event.preventDefault();
            if (field === "amount" && index < items.length - 1) {
                focusItemField(items[index + 1].id, "amount");
            } else if (field === "label" && index < items.length - 1) {
                focusItemField(items[index + 1].id, "label");
            }
            return;
        }

        if (field === "label") {
            handleLabelEnter(event, index);
            handleLabelBackspace(event, index);
        } else {
            handleAmountEnter(event, index);
            handleAmountBackspace(event, index);
        }
    }
    function handleAmountBackspace(event: KeyboardEvent, index: number) {
        if (event.key.toLowerCase() !== "backspace" || event.repeat) {
            return;
        }

        if ((items[index]?.amount ?? "").length === 0) {
            event.preventDefault();
            focusItemField(items[index].id, "label");
        }
    }

    function handleLabelBackspace(event: KeyboardEvent, index: number) {
        if (event.key.toLowerCase() !== "backspace" || event.repeat) {
            return;
        }

        if ((items[index]?.label ?? "").length === 0) {
            event.preventDefault();
            if (items.length === 1) {
                return;
            }

            removeRow(items[index].id);

            const prevItem = items[index - 1];
            if (prevItem) {
                tick().then(() => focusItemField(prevItem.id, "amount"));
            }
        }
    }

    function handleLabelEnter(event: KeyboardEvent, index: number) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();
        const item = items[index];
        if (!item) {
            return;
        }

        focusItemField(item.id, "amount");
    }

    async function handleAmountEnter(event: KeyboardEvent, index: number) {
        if (event.key !== "Enter") {
            return;
        }

        event.preventDefault();

        const nextItem = items[index + 1];
        if (nextItem) {
            focusItemField(nextItem.id, "label");
            return;
        }

        const newItemId = addRow();
        await tick();
        focusItemField(newItemId, "label");
    }

    function addRow(): number {
        const id = nextId;
        items = [...items, { id, label: "", amount: "" }];
        nextId += 1;
        return id;
    }

    function removeRow(id: number) {
        if (items.length === 1) {
            return;
        }
        items = items.filter((item) => item.id !== id);
    }
</script>

{#snippet sectionHeading(text: string)}
    <h3 class="m-0 text-xl md:text-[1.25rem]">{text}</h3>
{/snippet}

{#snippet tableHeader(text: string)}
    <th scope="col" class="text-left align-top text-muted-foreground border-b border-border py-1.5 px-1 text-[0.9rem] font-semibold whitespace-nowrap">
        {text}
    </th>
{/snippet}

{#snippet currencyInput(
    valueGetter: () => string,
    valueSetter: (v: string) => void,
    placeholder = "Enter a price...",
    ariaLabel?: string,
    dataItemId?: number,
    dataItemField?: string,
    onkeydown?: (e: KeyboardEvent) => void
)}
    <div class="currency-input relative before:content-['$'] before:absolute before:inset-[1px_auto_1px_1px] before:w-[1.9rem] before:flex before:items-center before:justify-center before:leading-none before:text-muted-foreground before:bg-[#414141] before:font-semibold before:pointer-events-none before:rounded-l-[calc(0.5rem-1px)] before:border-r before:border-border [&>input]:pl-[2.6rem]">
        <input
            type="text"
            inputmode="decimal"
            class="w-full rounded-lg px-3 py-2.5 font-sans h-9 text-sm border border-border bg-background text-foreground"
            bind:value={valueGetter, valueSetter}
            {placeholder}
            aria-label={ariaLabel}
            data-item-id={dataItemId}
            data-item-field={dataItemField}
            {onkeydown}
        />
    </div>
{/snippet}

{#snippet resultRow(label: string, value: string, extraClass = "border-border")}
    <div class="result-row flex flex-wrap justify-between items-center gap-1.5 rounded-lg p-3 bg-[#181818] border sm:flex-nowrap sm:gap-0 {extraClass}">
        <span>{label}</span>
        <strong>{value}</strong>
    </div>
{/snippet}

{#snippet itemsTable()}
    <div class="table-wrap overflow-x-visible md:overflow-x-auto">
        <table class="item-table block w-full border-collapse md:table">
            <thead class="hidden md:table-header-group">
                <tr>
                    {@render tableHeader("Label (optional)")}
                    {@render tableHeader("Original Price")}
                    {@render tableHeader("Action")}
                </tr>
            </thead>
            <tbody class="flex flex-col gap-3 mt-2 md:table-row-group md:gap-0 md:mt-0">
                {#each items as item, index (item.id)}
                    <tr class="block w-full bg-[#1a1a1a] border border-border rounded-lg p-[0.55rem] md:table-row md:bg-transparent md:border-0 md:rounded-none md:p-0">
                        <td
                            data-label="Label"
                            class="block w-full py-[0.3rem] px-0 text-left before:block before:content-[attr(data-label)] before:text-muted-foreground before:text-[0.78rem] before:font-bold before:mb-1 md:table-cell md:w-[48%] md:align-top md:py-1.5 md:px-1 md:before:hidden"
                        >
                            <input
                                type="text"
                                class="w-full rounded-lg px-3 py-2.5 font-sans h-9 text-sm border border-border bg-background text-foreground"
                                bind:value={items[index].label}
                                placeholder={`Item #${index + 1}`}
                                aria-label={`Label for item ${index + 1}`}
                                data-item-id={item.id}
                                data-item-field="label"
                                onkeydown={(event) => handleFieldKeydown(event, index, "label")}
                            />
                        </td>
                        <td
                            data-label="Original Price"
                            class="block w-full py-[0.3rem] px-0 text-left before:block before:content-[attr(data-label)] before:text-muted-foreground before:text-[0.78rem] before:font-bold before:mb-1 md:table-cell md:w-[40%] md:align-top md:py-1.5 md:px-1 md:before:hidden"
                        >
                            <div class="amount-cell">
                                {@render currencyInput(
                                    () => items[index].amount,
                                    (value) => setItemAmount(index, value),
                                    "Enter a price...",
                                    `Amount for item ${index + 1}`,
                                    item.id,
                                    "amount",
                                    (event) => handleFieldKeydown(event, index, "amount")
                                )}
                                {#if parsedRows[index].hasAmount && !parsedRows[index].isAmountValid}
                                    <small class="block text-xs mt-1 md:mt-1.5 text-destructive">Enter a valid non-negative amount (max 2 decimals).</small>
                                {/if}
                            </div>
                        </td>
                        <td
                            class="action-cell block w-full py-[0.3rem] px-0 text-left before:block before:content-[attr(data-label)] before:text-muted-foreground before:text-[0.78rem] before:font-bold before:mb-1 md:table-cell md:w-[12%] md:align-top md:py-1.5 md:px-1 md:before:hidden"
                            data-label="Action"
                        >
                            <Button
                                variant="destructive"
                                class="w-full"
                                onclick={() => removeRow(item.id)}
                                disabled={items.length === 1}
                            >
                                Remove
                            </Button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/snippet}

{#snippet outputSection()}
    {@render sectionHeading("Output")}
    <div class="bg-card border border-border flex flex-row gap-2.5 mb-4">
        <div class="flex-1 rounded-lg p-3">
            <span class="block text-xs mb-1 text-muted-foreground">Original subtotal</span>
            <strong class="text-[1.05rem]">{formatCents(sourceSubtotalCents)}</strong>
        </div>
        <div class="flex-1 rounded-lg p-3">
            <span class="block text-xs mb-1 text-muted-foreground">Scale factor</span>
            <strong class="text-[1.05rem]">{parseFloat(scaleFactor?.toFixed(6) ?? "0").toString()}</strong>
        </div>
    </div>

    <div class="result-list flex flex-col gap-2">
        {#each scaledBreakdown as row}
            {@render resultRow(row.label, formatCents(row.scaledCents))}
        {/each}
    </div>

    {@render resultRow("Scaled total", formatCents(scaledSubtotalCents), "totals-check border-green-700 mt-3")}
{/snippet}

<Title title="Price Scaler" />

<Holder class="card flex flex-col gap-4 rounded-xl">
    <div class="flex flex-col gap-2">
        <h1 class="m-0 text-2xl md:text-3xl">Price Scaler</h1>
        <p class="leading-[1.35] text-muted-foreground">
            This calculator can be used for many purposes,
            one of which is evenly distributing a total price across
            multiple item prices.
        </p>
        <p class="leading-[1.35] text-muted-foreground">
            Enter the total that you were charged and the item prices.
            Each item's price keeps the same ratio while being increased
            evenly to add up to the total price.
        </p>
    </div>

    <div class="total flex flex-col gap-2">
        {@render sectionHeading("Total")}
        {@render currencyInput(() => totalInput, setTotalInput)}
    </div>

    <div class="flex flex-col gap-1">
        <div class="rows-header flex flex-wrap items-center justify-between gap-2 md:flex-nowrap md:gap-0">
            {@render sectionHeading("Items")}
            <Button onclick={addRow} class="w-full md:w-auto">
                Add Item
            </Button>
        </div>

        {@render itemsTable()}
    </div>

    <div>
        {#if totalCents === null || totalCents <= 0}
            <p class="m-0 text-destructive">Enter a total price.</p>
        {:else if invalidAmountCount > 0}
            {#if invalidAmountCount === 1}
                <p class="m-0 text-destructive">One of your item prices is invalid.</p>
            {:else}
                <p class="m-0 text-destructive">Multiple of your item prices are invalid.</p>
            {/if}
        {:else if sourceItems.length === 0}
            <p class="m-0 text-destructive">Add at least one item price.</p>
        {:else if sourceSubtotalCents === 0}
            <p class="m-0 text-destructive">Item price subtotal must be greater than $0.00.</p>
        {/if}
    </div>

    {#if canScale && totalCents !== null}
        {@render outputSection()}
    {/if}
</Holder>
