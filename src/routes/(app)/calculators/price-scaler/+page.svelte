<script lang="ts">
    import { tick } from "svelte";
    import Title from "$lib/components/title.svelte";

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

<Title title="Price Scaler" />

<div class="calculator-page">
    <div class="card">
        <div>
            <h1>Price Scaler</h1>
            <p>
                This calculator can be used for many purposes,
                one of which is evenly distributing a total price across
                multiple item prices.
                <br><br>
                Enter the total that you were charged and the item prices.
                Each item's price keeps the same ratio while being increased
                evenly to add up to the total price.
            </p>
        </div>

        <div class="total">
            <h2>Total</h2>
            <div class="currency-input">
                <input
                    type="text"
                    inputmode="decimal"
                    bind:value={() => totalInput, setTotalInput}
                    placeholder="Enter a price..."
                />
            </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
            <div class="rows-header">
                <h2>Items</h2>
                <button type="button" onclick={addRow}>Add Item</button>
            </div>

            <div class="table-wrap">
                <table class="item-table">
                    <thead>
                        <tr>
                            <th scope="col">Label (optional)</th>
                            <th scope="col">Original Price</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each items as item, index (item.id)}
                            <tr>
                                <td data-label="Label">
                                    <input
                                        type="text"
                                        bind:value={items[index].label}
                                        placeholder={`Item #${index + 1}`}
                                        aria-label={`Label for item ${index + 1}`}
                                        data-item-id={item.id}
                                        data-item-field="label"
                                        onkeydown={(event) => handleFieldKeydown(event, index, "label")}
                                    />
                                </td>
                                <td data-label="Original Price">
                                    <div class="amount-cell">
                                        <div class="currency-input">
                                            <input
                                                type="text"
                                                inputmode="decimal"
                                                bind:value={() => items[index].amount, (value) => setItemAmount(index, value)}
                                                placeholder="Enter a price..."
                                                aria-label={`Amount for item ${index + 1}`}
                                                data-item-id={item.id}
                                                data-item-field="amount"
                                                onkeydown={(event) => handleFieldKeydown(event, index, "amount")}
                                            />
                                        </div>
                                        {#if parsedRows[index].hasAmount && !parsedRows[index].isAmountValid}
                                            <small>Enter a valid non-negative amount (max 2 decimals).</small>
                                        {/if}
                                    </div>
                                </td>
                                <td class="action-cell" data-label="Action">
                                    <button
                                        type="button"
                                        class="danger"
                                        onclick={() => removeRow(item.id)}
                                        disabled={items.length === 1}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <div>
            {#if totalCents === null || totalCents <= 0}
                <p class="error">Enter a total price.</p>
            {:else if invalidAmountCount > 0}
                {#if invalidAmountCount === 1}
                    <p class="error">One of your item prices is invalid.</p>
                {:else}
                    <p class="error">Multiple of your item prices are invalid.</p>
                {/if}
            {:else if sourceItems.length === 0}
                <p class="error">Add at least one item price.</p>
            {:else if sourceSubtotalCents === 0}
                <p class="error">Item price subtotal must be greater than $0.00.</p>
            {/if}
        </div>

        {#if canScale && totalCents !== null}
            <h2>Output</h2>
            <div class="summary-grid">
                <div>
                    <span>Original subtotal</span>
                    <strong>{formatCents(sourceSubtotalCents)}</strong>
                </div>
                <div>
                    <span>Scale factor</span>
                    <strong>{parseFloat(scaleFactor?.toFixed(6) ?? "0").toString()}</strong>
                </div>
            </div>

            <div class="result-list">
                {#each scaledBreakdown as row}
                    <div class="result-row">
                        <span>{row.label}</span>
                        <strong>{formatCents(row.scaledCents)}</strong>
                    </div>
                {/each}
            </div>

            <div class="totals-check">
                <span>Scaled total</span>
                <strong>{formatCents(scaledSubtotalCents)}</strong>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .calculator-page {
        display: grid;
        grid-template-columns: 1fr;
        min-height: auto;
        gap: 1.5rem;
        padding: 1.5rem;
        color: g.$light;
        background: g.$dark;
        max-width: 1024px;
        margin-inline: auto;
    }

    .card {
        background: #252525;
        border: 1px solid g.$border;
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h1 {
        margin: 0;
        font-size: 1.8rem;
    }

    h2 {
        margin: 0;
    }

    p {
        color: g.$darker-light;
        line-height: 1.35;
    }

    input {
        width: 100%;
        border: 1px solid g.$border;
        border-radius: 0.5rem;
        background: g.$dark;
        color: g.$light;
        padding: 0.6rem 0.75rem;
        font-family: g.$stack;
    }

    .total {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .currency-input {
        position: relative;
        --w: 1.9rem;

        &::before {
            content: "$";
            position: absolute;
            inset: 1px auto 1px 1px;
            width: var(--w);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            color: g.$darker-light;
            background-color: #414141;
            font-weight: 600;
            pointer-events: none;
            border-top-left-radius: calc(0.5rem - 1px);
            border-bottom-left-radius: calc(0.5rem - 1px);
            border-right: 1px solid g.$border;
        }

        input {
            padding-left: calc(var(--w) + 0.7rem);
        }
    }

    button {
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        font-family: g.$stack;
        padding: 0.5rem 1rem;
        cursor: pointer;
        background: g.$primary;
        color: g.$light;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .danger {
        background: darken(g.$red, 20%);
        border: 1px solid g.$red;
    }

    .rows-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .table-wrap {
        overflow-x: auto;
    }

    .item-table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            text-align: left;
            vertical-align: top;
            padding: 0.35rem 0.3rem;
        }

        th {
            color: g.$darker-light;
            font-size: 0.9rem;
            font-weight: 600;
            border-bottom: 1px solid g.$border;
            white-space: nowrap;
        }

        td:first-child {
            width: 48%;
        }

        td:nth-child(2) {
            width: 40%;
        }

        td:last-child {
            width: 12%;

            button {
                width: 100%;
            }
        }
    }

    .amount-cell small {
        display: block;
        color: g.$red;
        margin-top: 0.35rem;
        font-size: 0.75rem;
    }

    .action-cell {
        width: 100%;
    }

    .error {
        color: g.$red;
        margin: 0;
    }

    .summary-grid {
        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        margin-bottom: 1rem;

        div {
            flex: 1;
            background: #181818;
            border-radius: 0.5rem;
            padding: 0.7rem;
            border: 1px solid #2f2f2f;

            span {
                display: block;
                font-size: 0.78rem;
                color: g.$darker-light;
                margin-bottom: 0.2rem;
            }

            strong {
                font-size: 1.05rem;
            }
        }
    }

    .result-list {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
    }

    .result-row,
    .totals-check {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #181818;
        border-radius: 0.5rem;
        padding: 0.75rem 0.75rem;
        border: 1px solid g.$border;
    }

    .totals-check {
        margin-top: 0.8rem;
        border-color: darken(g.$green, 15%);
    }

    @media (max-width: 680px) {
        .calculator-page {
            padding: 0.9rem;
            gap: 1rem;
        }

        .card {
            padding: 0.85rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        h2 {
            font-size: 1.25rem;
        }

        .rows-header {
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .rows-header button {
            width: 100%;
        }

        .table-wrap {
            overflow-x: visible;
        }

        .item-table,
        .item-table thead,
        .item-table tbody,
        .item-table tr,
        .item-table th,
        .item-table td {
            display: block;
            width: 100%;
        }

        .item-table thead {
            display: none;
        }

        .item-table tbody {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 0.5rem;
        }

        .item-table tr {
            background: #1a1a1a;
            border: 1px solid g.$border;
            border-radius: 0.5rem;
            padding: 0.55rem;
        }

        .item-table td {
            padding: 0.3rem 0;
            text-align: left !important;
        }

        .item-table td::before {
            content: attr(data-label);
            display: block;
            color: g.$darker-light;
            font-size: 0.78rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        .item-table td {
            width: 100% !important;
        }

        .amount-cell small {
            margin-top: 0.25rem;
        }
    }

    @media (max-width: 420px) {
        .result-row,
        .totals-check {
            flex-wrap: wrap;
            gap: 0.35rem;
        }
    }
</style>
