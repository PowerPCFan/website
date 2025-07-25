<script lang="ts">
    import Title from "$lib/components/title.svelte";
</script>

<Title title="Installing Windows" />

<br />
<div class="box">
    <h1>How to Install Windows 10/11</h1>
    <hr />
    <br />

    <h4>What OS should I choose?</h4>
    <p>For PCs, you have two choices: Windows or Linux.</p>

    <p>If your PC has:</p>
    <ul>
        <li><p>Intel Core 10th Gen/AMD Ryzen 3000 or newer</p></li>
        <li><p>8GB RAM or more</p></li>
    </ul>
    <p>then you should install Windows 11.</p>

    <br />

    <p>If your PC has:</p>
    <ul>
        <li><p>Intel Core 9th Gen/AMD Ryzen 2000 or older</p></li>
        <li><p>Any AMD FX series CPU</p></li>
        <li><p>Any Intel Celeron or Pentium CPU</p></li>
        <li><p>4GB RAM or more</p></li>
    </ul>
    <p>then you should install Windows 10.</p>

    <br />

    <p>
        If your PC has a CPU that is 10+ years old or less than 2GB RAM, then you
        should install a Linux distro such as Linux Mint or Arch Linux. Linux isn't
        just for old hardware though - if you'd like to give it a try or if you
        prefer Linux over Windows, feel free to install it.
    </p>

    <h3><u>Before you install Windows</u></h3>
    <ul>
        <li>
            <p>
                Ensure that the BIOS is updated to the latest version available on the
                manufacturer's website.
            </p>
        </li>
        <li>
            <p>
                Ensure that your USB Flash Drive is 8GB or bigger and in 100% working
                condition.
            </p>
        </li>
        <li>
            <p>
                Ensure that you have another computer such as a laptop that is running
                Windows 10 or Windows 11 and has decent specs for you to make the USB.
                You can borrow a friend's PC if needed.
            </p>
        </li>
    </ul>

    <hr />

    <h2><u>Installing Windows 10</u></h2>
    <h3>Downloading Windows and making your USB</h3>
    <ul>
        <li>
            Download a Windows 10 ISO from <a href="https://msdl.gravesoft.dev/"
                >MSDL &lpar;Microsoft Software Download Listing&rpar;</a
            >. The proper ISO image is named "Windows 10 22H2 V1". You'll need to set
            your language. Once you get to the download page, select "IsoX64 Download"
            - <b>NOT</b> the X86 one!
        </li>
        <li>
            Download Rufus to flash your USB. <a
                href="https://github.com/pbatard/rufus/releases/download/v4.5/rufus-4.5p.exe"
                >This Link</a
            > will download the portable version.
        </li>
        <li>Plug in your USB flash drive.</li>
        <li>Open Rufus.</li>
        <li>
            Under 'Device' select your 8GB or larger USB Flash Drive. IT WILL BE
            ERASED so back up any important files that might be on it.
        </li>
        <li>Under 'Boot Selection' select 'Disk or ISO Image'.</li>
        <li>
            Next to the dropdown under 'Boot Selection' there is a "SELECT" button.
            Click it, and find + choose the Windows 10 22H2 V1 ISO you downloaded from
            MSDL.
        </li>
        <li>
            Under 'Image Option' make sure it is set to 'Standard Windows
            Installation'.
        </li>
        <li>Set the partition scheme to GPT.</li>
        <li>Set the target system to UEFI &lpar;non-CSM&rpar;.</li>
        <li>DO NOT touch the other settings like cluster size or filesystem.</li>
    </ul>
    <h3>Booting the USB and Installing Windows</h3>
    <ul>
        <li>Shut down the TARGET PC that you'd like to install Windows on.</li>
        <li>
            Unplug or remove every hard drive or SSD besides the one that you'll be
            installing Windows to. If you only have one drive, skip this.
        </li>
        <li>
            Turn on the PC. It should automatically boot the USB. If not, go to the
            BIOS and set the boot order to boot USB first.
        </li>
        <li>
            Windows will ask you to set a time/date format and a keyboard layout.
            Choose the correct options for your country's date format and keyboard
            layout. Keep going through the installer. When it says "Enter a product
            key," select "I don't have a product key".
        </li>
        <li>
            Choosing a Windows Edition - go with Windows 10 Pro since it has far more
            features and sounds more "pro" than the home version.
        </li>
        <li>
            When you get to the Disk Selection, you should have one option which is
            Drive 0 Unallocated Space. If there are other options or names shown, keep
            deleting the partitions until you get the Drive 0 Unallocated Space
            option. Now you can install Windows!
        </li>
        <li>
            At the end of the installation, it will tell you that your PC will
            automatically restart in 10 seconds. Unplug the USB flash drive
            immediately and restart your PC. It should boot into the newly installed
            Windows.
        </li>
    </ul>

    <h2>Installing Windows 11</h2>
    <p>
        Follow the exact same process as Windows 10 but ensure that Secure Boot is
        enabled in BIOS and that you download the "Windows 11 23H2 V2" ISO from MSDL
        instead of the Windows 10 one.
    </p>

    <h2>Post-Install</h2>
    <h4>
        &nbsp;•&nbsp;&nbsp;Step 1 - Running my PC Flipper Windows Script to set up
        Windows with apps, drivers, and more
    </h4>
    <p>
        Download the .exe from the <a target="_blank" href="https://github.com/PowerPCFan/pc-flipper-windows-script/releases/latest">releases page</a> on GitHub. Run the .exe. Once open,
        explore the options and select what you'd like to do. Then, run the script.
    </p>
    <br />
    <h4>&nbsp;•&nbsp;&nbsp;Step 2 - OOBE + Audit Mode</h4>
    <p>
        <em
            >Note: Do not run this unless you are going to sell the computer you are
            installing Windows on. It puts the PC back into the setup process.</em
        ><br />I'm pretty bad at explaining the OOBE and Audit Mode. You should go
        check out the OOBE and Audit Mode part of
        <a href="https://rentry.co/pcflippinginstall#oobe-and-audit-mode"
            >this guide</a
        > which explains audit mode and what it's used for.
    </p>

    <br />
    <br />
    <br />
</div>

<style lang="scss">
    @use '/static/scss/global.scss' as g;

    .box {
        background-color: #262626;
        color: #ebebeb;
        width: 88%;
        margin: 0 auto;
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 10px;
    }

    h1 {
        text-align: center;
        font-size: 27pt;
    }

    h2 {
        text-align: left;
        font-size: 20pt;
    }

    h3 {
        text-align: left;
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: -9;
    }

    h4 {
        text-align: left;
        font-size: 13pt;
        font-weight: bold;
        margin: 0;
        margin-bottom: 2;
    }

    p, li {
        text-align: left;
        font-size: 13pt;
        margin: 0;
    }

    a {
        text-align: left;
        font-size: 13pt;
        margin: 0;
        text-decoration: underline;
        color: g.$link;
    }
</style>