<script lang="ts">
    import type { JawaListing } from '$lib/types/JawaListing';
    import { onMount } from 'svelte';

    const listingsUrl = "https://raw.githubusercontent.com/PowerPCFan/shop/refs/heads/main/output/listings.json";
    let listings: JawaListing[] | null = $state(null);

    onMount(async () => {
        const response = await fetch(listingsUrl);
        listings = await response.json();

//         listings = [
//     {
//         "uuid": "406dc02f-d88e-52be-839c-28b2a2e8ae6a",
//         "title": "\ud83e\udd0d\ud83e\ude75 RTX 3060/ Ryzen 5500 / 16GB / 1TB Gaming PC \ud83e\ude75\ud83e\udd0d- ARGB, WiFi, BlueTooth",
//         "url": "https://www.jawa.gg/product/98590/rtx-3060-ryzen-5500-16gb-1tb-gaming-pc-argb-wifi-bluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-dd728afe037f2486f9465fa93c3dacfe/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "$675.00",
//         "sold_out": false,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. Ideal for 1080P or 1440P gaming. Stress tested and drivers freshly installed, in perfect condition. Included is a CPU cooler with a LED temperature and utilization screen, perfect for monitoring performance. \n---\n- ARGB Control via controller\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** EVGA RTX 3060 12GB w/ 2X Fans \n\n**-Processor (CPU):** AMD Ryzen 5 5500 6 Cores 12 Threads\n\n**-Solid-State Drive (SSD):** Crucial 1TB SSD\n\n**-Memory (RAM):** 16GB 3000MHz DDR4 (Dual channel)\n\n**-Motherboard:** ASRock B450M MATX\n\n**-PSU (Power Supply):** RaidMax Cobra 650W 80+ Gold\n\n**-Case:** SAMA Q5 MATX ARGB\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\n**If you need estimates for any game, let me know through chat.**\n\n---\n\n** Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-dd728afe037f2486f9465fa93c3dacfe/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-cc72e9b36449b174ba6d75fe7a071744/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-303078c08e6961355606b3702c1313cb/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-219683b15752e3a53c87e2ebaf2ba7d9/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-66f2306862b7450a156445e99bd090de/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-8fd2217128faf9d93e5e1292a750f8c5/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-29817d27d3413d351ac648e1511226a4/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-74362ec753956f74fe359a6b8c08e336/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e46b88b28d4c46fd43942ebce61c09d6/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-f537a98bad2428ba1b8466d8d2bf5723/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "60.00"
//     },
//     {
//         "uuid": "bf9cf19e-5e9b-5965-8e86-1fa8d27403b8",
//         "title": "\ud83d\udd25Value Gaming PC \u2013 RTX 3060, Ryzen 5 3600X, 16GB RAM, 1TB SSD - RGB, WiFi\ud83d\udd25",
//         "url": "https://www.jawa.gg/product/94692/value-gaming-pc-rtx-3060-ryzen-5-3600x-16gb-ram-1tb-ssd-rgb-wifi",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-5aa88c2fd1cf4e15f018a74bbe1f26bc/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "$625.00",
//         "sold_out": false,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. Plug and play out of the box, ships within 2 days. This PC has been fully stress tested to ensure perfect functionality, all parts are in perfect working order. \n\n---\n\n- ARGB Control via dedicated button\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** HP NVIDIA RTX 3060 12GB VRAM\n\n**-Processor (CPU):** AMD Ryzen 5 3600X 6 Cores 12 Threads \n\n**-Solid-State Drive (SSD):** Crucial 1TB SSD\n\n**-Memory (RAM):** 16GB 3200MHz DDR4 (Dual Channel)\n\n**-Motherboard:** AMD B450M Black MATX\n\n**-PSU (Power Supply):** Corsair CX550 80+ Bronze Certified\n\n**-Case:** OKINOS AQUA 3 MATX Black ARGB\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=ZFlyV9itYVU\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come packaged securely with instapak and bubblewrap. Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included, just removed to reduce glare in photos\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-5aa88c2fd1cf4e15f018a74bbe1f26bc/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7e4473a4810bbcb0da817c948c43aedc/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-5e5779628f5f0588698e917e282d3225/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2f7b278bce6d3125c60f9a66f273feb1/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-886049ebe9b4245b9cba8eea206c95a2/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-5e6641a2c6e1a16349b25ab8ab0502c4/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-46422a743a1cbb8b47c1ce4d50eb21e4/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-bd39df7b47680504d524655ffd353e8c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-3c22a72037cc033a0aba2bbfcf556433/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-5b65127765b8116a7f6e4a644bb71030/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "bfc1b0c3-78da-559b-a19b-def96f237676",
//         "title": "RGB Black Gaming PC \u2013 RTX 5060, Ryzen 7 3700X, 32GB RAM, 1TB SSD - WiFi, BlueTooth - Mirage 4",
//         "url": "https://www.jawa.gg/product/97678/rgb-black-gaming-pc-rtx-5060-ryzen-7-3700x-32gb-ram-1tb-ssd-wifi-bluetooth-mirage-4",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-a2dc355df1ffea55c2a51c7cc27fcb3e/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "$879.99",
//         "sold_out": false,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 5060 has all new DLSS 4.0 features, AV1 encoding support, and Nvidia Reflex/Broadcast features. Plug and play out of the box, ships within 2 days. Perfect PC to play in 1080P/1440P.\n\n---\n\n- ARGB Control via dedicated button \u2713\n- All drivers and updates have been installed \u2713\n- Wi-Fi + Bluetooth is built in \u2713\n- Stressed tested and working perfectly \u2713\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** GIGABYTE GAMING OC RTX 5060 8GB w/ 3X Fans\n\n**-Processor (CPU):** AMD Ryzen 7 3700X 8 Cores 16 Threads \n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** Corsair 32GB 3000MHz DDR4\n\n**-Motherboard:** ASUS PRIME B550M WIFI II\n\n**-PSU (Power Supply):** RM Cobra 650W 80+ Gold w/ 12VPHWR Cable\n\n**-Case:** Okinos Mirage 4 MATX w/ 6X ARGB 120MM Fans\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nIf you need estimates for any game, let me know through chat. \n\n---\n\n**Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nShips within 3 business days. Packed professionally with care with Instapak and bubblewrap. \n\nShipping is only available to buyers in the CONUS, sorry. If you are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-a2dc355df1ffea55c2a51c7cc27fcb3e/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b6739444345ac6eb73564b0a5f0b27c9/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-99c37199472250e788b648fc2594addc/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-080123e8f6f46d3f94826cf4eb1ae8e1/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-74a8cb3be481edf5512a34dcf043286f/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-f39960d4fc9f498db86096827bf11aa4/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-66b54f65f98316f20a87a4379271e5d2/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e652e03af89ed435276695be0f0b6515/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "N/A"
//     },
//     {
//         "uuid": "412b8a1c-604f-5256-b950-18552c04010c",
//         "title": "Clean White Gaming PC \u2013 RTX 5060, Ryzen 5 5600X, 32GB, 1TB SSD - RGB, WiFi, BlueTooth",
//         "url": "https://www.jawa.gg/product/93263/clean-white-gaming-pc-rtx-5060-ryzen-5-5600x-32gb-1tb-ssd-rgb-wifi-bluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-e7e59914b8f33d93f01c7856e8f2e3cc/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "$825.00",
//         "sold_out": false,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 5060 has all new DLSS 4.0 features, AV1 encoding support, and Nvidia Reflex/Broadcast features. Plug and play out of the box, ships within 2 days. Perfect PC to play in 1080P/1440P.\n\n---\n\n- ARGB Control via software\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** GIGABYTE GAMING OC RTX 5060 8GB w/ 3X Fans\n\n**-Processor (CPU):** AMD Ryzen 5 5600X 6 Cores 12 Threads 4.6GHz\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** Corsair Vengeance 32GB 3200MHz DDR4\n\n**-Motherboard:** ASRock B550 Phantom Gaming 4/AC\n\n**-PSU (Power Supply):** Thermaltake GX2 600W 80+ GOLD Certified\n\n**-Case:** RaidMax Infinta i801 ATX ARGB\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=Pg8m9G5onuc \n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come double-boxed to ensure they arrive in perfect condition.\nShipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-e7e59914b8f33d93f01c7856e8f2e3cc/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-77fc1b3e13138fcddf1e46a268d0b8c0/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-8fbb540bd25eb1e12309ac9c900b5855/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-ca52a18f982bdb8314a8d44fdd0ef7c6/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-1b567c738dcf2fece111387305fad417/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-bb67e3a1eb4b4904bf83cc7040ff7b99/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-3de047cf3439cff3ea6db9364e88c82d/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b71a26835129f69315ea7d64196f4a33/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "c14674c4-bf86-5f5c-9333-b33afeff946b",
//         "title": "\u2764\ufe0f\ud83d\udda4Budget RGB PC - GTX 1070, 16GB DDR4, 500GB SSD, Xeon E5 2667 V4- WiFi/BT\u2764\ufe0f\ud83d\udda4",
//         "url": "https://www.jawa.gg/product/98104/budget-rgb-pc-gtx-1070-16gb-ddr4-500gb-ssd-xeon-e5-2667-v4-wifibt",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-9a8d62902d277ef37f3bf6938210b6d7/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built gaming PC is perfect for gaming, streaming, editing ranging from eSports games to modern triple-A titles. Perfect starter PC to start playing 1080P Medium to High. ARGB lighting is built-in, WiFi and BlueTooth is also included.\n\n---\n\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** EVGA FTW GTX 1070 8GB\n\n**-Processor (CPU):** Intel Xeon E5 2667 V4 8 Cores 16 Threads (Beats i7 4770K)\n\n**-Solid-State Drive (SSD):** Samsung 500GB 840 SATA SSD\n\n**-Memory (RAM):** 16GB SKHynix DDR4\n\n**-Motherboard:** Mougol X99 MATX w/ free NVMe SSD slot\n\n**-PSU (Power Supply):** Thermaltake 600W \n\n**-Case:** SAMA Q5 ARGB w/ 3X Fans\n\n**-Operating System (OS):** Windows 10 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI included + Bluetooth\n\n---\n\n**If you need estimates for any games let me know through chat**\n\n---\n\n**All computers I sell come packaged securely with instapak and bubblewrap. Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included, just removed to reduce glare in photos\n- Fully stress tested and running as expected: computer is in \"fair' condition, all parts work and temps are good but have cosmetic blemishes that do not affect performance. \n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-9a8d62902d277ef37f3bf6938210b6d7/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-87c819a6b70fe74016c45c11eec08975/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7db14e151556935145375ddf36e7c093/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-35db059de734997152469faa55c95e32/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-4ecdb1f87334523790b26ac21acda23c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-eeefc4b2b1c9e7d2b1a7bf36f4b55a0c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-8abb5437cbd076f6e8efd06f79532f33/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-d41188ccb61cc992f67981f0cf997142/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-1d188d4375d78f916453e97aee94a94b/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b29422ac20c3f882dcaf47a3f7a3a0d4/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "50.00"
//     },
//     {
//         "uuid": "060e5f46-4345-5329-849b-158df6ed418f",
//         "title": "\ud83e\uddca\u2744\ufe0f\ud83e\uddca White Gaming PC \u2013 RTX 5060, Ryzen 5 5600X, 32GB RAM, 1TB SSD - WiFi, BlueTooth \ud83e\uddca\u2744\ufe0f\ud83e\uddca",
//         "url": "https://www.jawa.gg/product/98207/white-gaming-pc-rtx-5060-ryzen-5-5600x-32gb-ram-1tb-ssd-wifi-bluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-b4325a4226c6ccf13b0f4bcf20a56852/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 5060 has all new DLSS 4.0 features, AV1 encoding support, and Nvidia Reflex/Broadcast features. Plug and play out of the box, ships within 2 days. Perfect PC to play in 1080P/1440P.\n\n---\n\n- ARGB Control via dedicated button \u2713\n- All drivers and updates have been installed \u2713\n- Wi-Fi + Bluetooth is built in \u2713\n- Stressed tested and working perfectly \u2713\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** PNY NVIDIA RTX 5060 8GB \n\n**-Processor (CPU):** AMD Ryzen 5 5600X 6 Cores 12 Threads\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** G.SKILL 32GB 3200MHz DDR4\n\n**-Motherboard:** SOYO B450M MATX WHITE\n\n**-PSU (Power Supply):** RM Cobra 650W 80+ Gold w/ 12VPHWR Cable\n\n**-Case:** DarkFlash C275P MATX w/ 4X ARGB Fans\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI USB included + Bluetooth\n\n---\n\nIf you need estimates for any game, let me know through chat. \n\n---\n\n**Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nShips within 3 business days. Packed professionally with care with Instapak and bubblewrap. \n\nShipping is only available to buyers in the CONUS, sorry. If you are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-b4325a4226c6ccf13b0f4bcf20a56852/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-3a1ada7f8c5a94de0cfdea34784f5946/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-ab65247761c28fe5a67817e186a4efb5/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-4ead9c45c2be733e209b9710acb6eac9/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-d367d346b3670f53701c46e1a3228ef3/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2c8a8ad093a51dcda9c74831419b9729/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-d4732b6d30f8402e2cb91da9eb477e08/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e281187d2caab76c846282095e89862e/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-90d53097241dc33daa5cba0e3fe75481/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-a82eb2466d54e5fa701204aeb84ec1e3/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "60.00"
//     },
//     {
//         "uuid": "15c7ea46-68ea-5128-9f9b-e49607a2c22b",
//         "title": "\u2744\ufe0f1440P Powerhouse\u2744\ufe0f - RTX 3080 TI, Ryzen 7 5800X, 32GB RAM, 1TB NVMe - Whiteout/WiFi/ARGB",
//         "url": "https://www.jawa.gg/product/97787/1440p-powerhouse-rtx-3080-ti-ryzen-7-5800x-32gb-ram-1tb-nvme-whiteoutwifiargb",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-d2bf8e4b752d6cc6cd117b433de17736/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "---\nThis is a high-end gaming/streaming/AI/Content creation beast that will run anything you throw at it. It has ARGB, two glass panels, and a white theme. All drivers are installed along with updates. Feel free to ask questions through chat!\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** MSI NVIDIA RTX 3080 TI 12GB VENTUS\n\n**-Processor (CPU):** AMD Ryzen 7 5800X 8C 16T 4.6Ghz\n\n**-Solid-State Drive (SSD):** SP UD90 GEN4 1TB NVMe SSD\n\n**-Memory (RAM):**Corsair Vengeance 32GB (Dual channel)\n\n**-Motherboard:** X570 ATX\n\n**-CPU Cooler:** REDRAGON HL360 ARGB 360MM \n\n**-Case:** PCOOLER CPS T500 ATX ARGB\n\n**-Power Supply (PSU):** High Power HP1 850W 80+ Gold (B tier)\n\n**-Operating System (OS):** Windows 11 Pro Activated\n\n---\n\n- ARGB Control via button\n- All drivers and updates have been installed\n- Wi-Fi is included \n- Stressed tested and working\n---\n**Performance Benchmarks** \n\nhttps://youtu.be/64IuRZl8bI8?t=128\n---\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2X Wi-Fi Antenna\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\nFor general gaming performance, you can search \u201cRTX 3080 TI and Ryzen 7 5800X\u201d on youtube  for similar benchmarks.\n\nThanks for viewing this listing \u2013 feel free to reach out with any questions!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-d2bf8e4b752d6cc6cd117b433de17736/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-894a33bcd1ba6fe60a3d5467a3f52273/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-557ed6c56213174663dd579dad3af016/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-f8c5c72304870a019deb6f82bf4e48aa/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7947b28c8c0a0def3fe3b8971ab3ef9a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-caff53045d7adad5d99cfebedd4c5ff0/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-41e63b6cfc49c7d879872866e5d0ba43/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-8c54a16291688b72413fad716e9ec868/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-0469dfe469c8d1da9448953760404765/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-788fafdcaf02e50ffe2fd57657a80add/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "70.00"
//     },
//     {
//         "uuid": "9ad8bb9b-3aa2-5d52-a4bb-2db33b9822f3",
//         "title": "\u2744\ufe0f\ud83e\uddcaBudget White PC - GTX 1080, Ryzen 5 2600, 16GB DDR4, 1TB SSD\u2744\ufe0f\ud83e\uddca- WiFi/BT",
//         "url": "https://www.jawa.gg/product/97767/budget-white-pc-gtx-1080-ryzen-5-2600-16gb-ddr4-1tb-ssd-wifibt",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-793a56a44e1d128c54d5ce1e6ddf9393/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built gaming PC is perfect for gaming, streaming, editing ranging from eSports games to modern triple A titles. Built with the AM4 socket and a 650W 80+ GOLD 12VHPWR PSU ensures easy upgradability if needed. \n\n---\n\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** EVGA FTW GTX 1080 8GB\n\n**-Processor (CPU):** AMD Ryzen 5 2600 6 Cores 12 Threads\n\n**-Solid-State Drive (SSD):** Micron 1TB SSD\n\n**-Memory (RAM):** 16GB Corsair Vengeance DDR4 (Dual Channel)\n\n**-Motherboard:** ZSUS B450 MATX\n\n**-PSU (Power Supply):** RaidMax Cobra 650W 80+ Gold\n\n**-Case:** SAMA Q5 ARGB w/ 3X Fans\n\n**-Operating System (OS):** Windows 10 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI included + Bluetooth\n\n---\n\n**If you need estimates for any games let me know through chat**\n\n---\n\n**All computers I sell come packaged securely with instapak and bubblewrap. Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included, just removed to reduce glare in photos\n- Fully stress tested and running as expected with minor imperfections\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-793a56a44e1d128c54d5ce1e6ddf9393/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-211657325848e4ff640e44e0a682ec22/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-ebcef7a2698a32158d4936756405f3f7/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-19170456662e7260539f88b99514f8ec/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-4c7599f35cb0af738d1d8fc8f629762c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-0f8d6429bbaafa8e61524ee7b1ae84c8/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-d4a8583cbd5483ccda45a47f9541b9ab/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b488c15774180eda3de50a584e3a7fb3/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-fd04498d6938b01ada753942e0239bb5/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "50.00"
//     },
//     {
//         "uuid": "bbc3a2ea-bc80-5675-86ab-2f8c1c915798",
//         "title": "(PRIVATE) Silicon Power UD90 Gen4 1TB",
//         "url": "https://www.jawa.gg/product/96589/private-silicon-power-ud90-gen4-1tb",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-1b10d67cfe3da2aa5f6a2bf60c8cbe54/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "new without box working good\nPrivate listing do not buy",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-1b10d67cfe3da2aa5f6a2bf60c8cbe54/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-fe4b6763e3b528c6f35ebb3269bc934f/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "0.00"
//     },
//     {
//         "uuid": "a58a54dd-17f0-5e24-b9b6-12c0148cb655",
//         "title": "\ud83e\udd0d\ud83d\udc8eWhite Gaming PC \u2013 RTX 5060, Ryzen 5 5600X, 32GB RAM, 1TB SSD - RGB, WiFi, LED Screen\ud83e\udd0d\ud83d\udc8e",
//         "url": "https://www.jawa.gg/product/93891/white-gaming-pc-rtx-5060-ryzen-5-5600x-32gb-ram-1tb-ssd-rgb-wifi-led-screen",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-9967038181f63ecb3c700ed8fa56b3f6/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 5060 has all new DLSS 4.0 features, AV1 encoding support, and Nvidia Reflex/Broadcast features. Plug and play out of the box, ships within 2 days. Perfect PC to play in 1080P/1440P. Has an LED temperature display for the CPU/GPU and full ARGB control. \n\n---\n\n- ARGB Control via software\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** ASUS RTX 5060 8GB DUAL \n\n**-Processor (CPU):** AMD Ryzen 5 5600X 6 Cores 12 Threads 4.6GHz\n\n**-Solid-State Drive (SSD):** SP UD90 GEN4 1TB NVMe\n\n**-Memory (RAM):** Corsair Vengeance 32GB 3600MHz DDR4\n\n**-Motherboard:** ASRock X570 Phantom Gaming WiFI\n\n**-PSU (Power Supply):** RaidMax Cobra 600W 80+ GOLD Certified\n\n**-Case:** Montech XR White ATX ARGB\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=Pg8m9G5onuc \n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box. Comes packed securely.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-9967038181f63ecb3c700ed8fa56b3f6/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-52265be612ecebdc8276d1747f0f3ace/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e861d1ed21f3e78fc95b64daf2fe8f2f/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-a04768b729e1b8287d08b94abf426143/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-eabab6e81683bbfff77c2300dab90378/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e48e08583a9f028dd246180ff98e903c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-bc4cfa65058052d96fff3ed9e3567c23/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-1035b66caf508903156f681befcc78fe/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2884b58a7dd1a6cb6ef966883a3be1f0/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "6e1fb034-9ef6-58df-bc22-a3cd9c498c98",
//         "title": "\ud83e\udd0d\ud83e\ude75 RTX 4060/ Ryzen 5 5500 / 32GB / 1TB Gaming PC \ud83e\ude75\ud83e\udd0d- ARGB/WiFi/BlueTooth included",
//         "url": "https://www.jawa.gg/product/95563/rtx-4060-ryzen-5-5500-32gb-1tb-gaming-pc-argbwifibluetooth-included",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-070176876663aabe027f8841f3e56f98/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 4060 supports DLSS technology, AV1 encoding for streaming, and NVIDIA creative applications, making it perfect for gaming or workstation use. This PC has been fully stress tested to ensure perfect functionality, all parts are in perfect working order. \n\n---\n\n- ARGB Control via controller\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** LENOVO RTX 4060 8GB\n\n**-Processor (CPU):** AMD Ryzen 5 5500 6 Cores 12 Threads\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** Patriot 32GB DDR4 (Dual Channel)\n\n**-Motherboard:** AMD Machinist B450M White MicroATX Motherboard\n\n**-PSU (Power Supply):** CWT GPS600S-G 80+ Gold 600W\n\n**-Case:** Aigo C275P ARGB White MATX\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI USB included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=eDVKdSYtw3o\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come packaged securely with instapak and bubblewrap. \nShipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included, just removed to reduce glare in photos\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-070176876663aabe027f8841f3e56f98/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-f5776e3155fa7984cefdfca7eb0249fa/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-da969a333ddd63660bf679ad5e8e9279/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-db045f398f2dd0f6e2991f6703010fe4/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-01bc2b861cad21e240257b2639ca01f9/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-47d854b64803b410613b603a4606503a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-3a382b333a541ca53997afa46a80463a/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "2c79c780-5ef8-59e1-b97a-7b43be0b57ce",
//         "title": "\ud83e\udd0d\ud83d\udda4Budget ITX PC - GTX 1660 TI, Ryzen 7 1700, 16GB DDR4, 500GB SSD\ud83e\udd0d\ud83d\udda4- WiFi/BT",
//         "url": "https://www.jawa.gg/product/93919/budget-itx-pc-gtx-1660-ti-ryzen-7-1700-16gb-ddr4-500gb-ssd-wifibt",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-9b018875e6b14f35994f4a9407c0baad/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built ITX gaming PC is perfect for gaming, ranging from eSports games to more modern triple A titles. Built with the AM4 socket and a 650W 80+ GOLD 12VHPWR PSU ensures easy upgradability if needed. \n\n---\n\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** HP NVIDIA GTX 1660 TI \n\n**-Processor (CPU):** AMD Ryzen 7 1700 8 Cores 16 Threads\n\n**-Solid-State Drive (SSD):** Samsung 500GB SSD\n\n**-Memory (RAM):** 16GB Corsair Vengeance DDR4 (Dual Channel)\n\n**-Motherboard:** GIGABYTE AB350 ITX WIFI\n\n**-PSU (Power Supply):** RaidMax Cobra 650W 80+ Gold\n\n**-Case:** NZXT H210 Panda\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI included + Bluetooth\n\n---\n\nGaming Benchmarks : https://youtu.be/jFai6qUrWRs?t=464\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come packaged securely with instapak and bubblewrap. Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included, just removed to reduce glare in photos\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-9b018875e6b14f35994f4a9407c0baad/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-81aab040245a969253f1f3f90cea705a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2ae6d8bc296fb561dbd354c08bdee9b3/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-969d765ece883b6a75d7052316b8446f/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-a183f73e92f0652f3575d980129d5b5e/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "50.00"
//     },
//     {
//         "uuid": "ff39a576-cbed-5ec7-bd92-32b769c843aa",
//         "title": "\ud83d\udc8e\u2745White Gaming PC \u2013 RTX 3070, Ryzen 5 5600X, 32GB, 1TB SSD - RGB, WiFi\ud83d\udc8e\u2745",
//         "url": "https://www.jawa.gg/product/93915/white-gaming-pc-rtx-3070-ryzen-5-5600x-32gb-1tb-ssd-rgb-wifi",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-863053bf981dbf6462b7d004d3964670/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. Ideal for 1080P or 1440P gaming. Stress tested and drivers freshly installed, in perfect condition. \n---\n- ARGB Control via controller\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is included\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** EVGA XC3 RTX 3070 8GB w/ 3X Fans + ARGB\n\n**-Processor (CPU):** AMD Ryzen 5 5600X 6 Cores 12 Threads 4.6GHz\n\n**-Solid-State Drive (SSD):** SP 1TB NVMe\n\n**-Memory (RAM):** 32GB 3200MHz DDR4 (Dual channel)\n\n**-Motherboard:** GIGABYTE B550K MATX\n\n**-PSU (Power Supply):** EVGA Supernova G3 650 80+ GOLD\n\n**-Case:** DIYPC Q3 V2 ARGB MATX WHITE\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=HIdAXR6ZFBM\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n** Shipped quickly and securely. Shipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n1x Wi-Fi USB\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-863053bf981dbf6462b7d004d3964670/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-0f49707faa340c248cfe122d78a91982/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-35c8f6964b81942d068cc3223210aa19/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-197a9890bdf766fed2f30b5ef2d91516/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7de065650cbe43ddac3517c689d17a4a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-29d5f1a524c6f9b8c8a615af3daaa61f/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-41a7f8fc32fb4217ddb74b24c4db505d/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2f89a0f1d8250cbf92107f2463955624/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-574fb3499bdb9049e968923b61227e1c/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "a0569698-9907-5255-8bdf-771d703786dc",
//         "title": "Simplistic Wood PC | RTX 5070 12GB, Ryzen 7 7700X, 32GB DDR5, 1TB NVMe, LCD AIO | Gaming PC",
//         "url": "https://www.jawa.gg/product/92408/simplistic-wood-pc-or-rtx-5070-12gb-ryzen-7-7700x-32gb-ddr5-1tb-nvme-lcd-aio-or-gaming-pc",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-43b183d3af30b26da76b71af884f4bd6/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "Built for gamers and creators who want power and aesthetics, this system delivers cutting-edge performance with the NVIDIA RTX 5070 12GB GPU and AMD Ryzen 7 7700X. Perfect for 1440P gaming, streaming, and editing. \n\n---\nUse code 'welcome10' for $10 off your first order!\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** NVIDIA RTX 5070 12GB PNY OC Edition\n\n**-Processor (CPU):** AMD Ryzen 7 7700X 8 cores / 16 threads, 5.4GHz\n\n**-Solid-State Drive (SSD):** Crucial T500 Gen4 NVMe 1TB\n\n**-Memory (RAM):** Kingston HyperX 32GB DDR5 6400MHz\n\n**-Motherboard:** GIGABYTE GAMING B650M WIFI\n\n**-CPU Cooler:** Sama SM240 240MM AIO w/ LCD display\n\n**-Case:** DIYPC MATX06 WOOD\n\n**-Power Supply (PSU):** HIGH POWER HP1 850W (B+ tier) 80+ Gold\n\n**-Operating System (OS):** Windows 11 Pro Activated\n\n---\n\nhttps://www.youtube.com/watch?v=3KkD42GY6_0\n\n---\n\ud83d\udce6 What's included in the box? \ud83d\udce6\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost.\n\n---\nFor general gaming performance, you can search \u201cRTX 5070  and Ryzen 7 7700X\u201d for similar benchmarks.\n\nThings to know:\n- ARGB + display Control via software\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\nThanks for viewing this listing \u2013 feel free to reach out with any questions!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-43b183d3af30b26da76b71af884f4bd6/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b01c7fd17ae2789d92861ce52ee4eac3/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-67eeff088c6d3ecf90e3109c2b9f7ef2/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-c9465288b6c7dafab0819c52dd756533/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "75.00"
//     },
//     {
//         "uuid": "949cfce4-e4cd-52ed-8034-a9247da41b1e",
//         "title": "\u2744\ufe0f\ud83e\uddca1440P Gaming PC - RTX 4070, Ryzen 7 5800XT, 32GB DDR4, 1TB NVMe\ud83e\uddca\u2744\ufe0f",
//         "url": "https://www.jawa.gg/product/78419/1440p-gaming-pc-rtx-4070-ryzen-7-5800xt-32gb-ddr4-1tb-nvme",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-c67fd841fa163ef55d99a56205001ac0/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "Plug-and-Play Gaming PC for Sale \u2013 Ready for 1440P Gaming! \ud83d\udd14New user? Get $10 OFF today by entering WELCOME10 in checkout!\n\n---\nThis is a high-end gaming/streaming/AI/Content creation beast that will run anything you throw at it. It has RGB, two glass panels, and a white theme. This PC has the RTX 4070 12GB, a great GPU perfect for 1440P Gaming. \n\n**Specifications**\n\n**-Graphics Card (GPU):** Zotac Twin Edge RTX 4070\n\n**-Processor (CPU):** AMD Ryzen 7 5800XT 8C 16T 4.8GHz\n\n**-Solid-State Drive (SSD):** Silicon Power A60 1TB NVMe SSD\n\n**-Memory (RAM):** Corsair Dominator 32GB DDR4 3447MHz\n\n**-Motherboard:** ASRock B450M AC r2.0 \n\n**-CPU Cooler:** Thermalright FROZEN Warframe 240MM with customizable screen  \n\n**-Case:** Zalman P10 MicroATX PC case\n\n**-Power Supply (PSU):** MSI Mag AB550BN\n\n**-Operating System (OS):** Windows 11 Pro Activated\n\n---\n**Performance Benchmarks** \n\nhttps://youtu.be/FflFWHorrwI?si=7nWW6f02kN-CH87z\n\nExpect slightly better CPU performance (XT model installed) \n\n---\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi antennas\ud83d\udedc\n\n**PC COMES DOUBLE BOXED W/ INSTAPAK TO ENSURE IT ARRIVES IN PERFECT CONDITION**\n**WILL BE SHIPPED OUT WITHIN 3 DAYS**\n\n---\nFor general gaming performance, you can search \u201cRTX 4070 and Ryzen 7 5800XT\u201d on youtube for similar benchmarks.\n\nThanks for viewing this listing \u2013 feel free to reach out with any questions!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-c67fd841fa163ef55d99a56205001ac0/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b5903c9382863b53ae6b6ef06cada548/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-dcfaff0d933eb033b3b17187670ca346/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7e9f8b4338a5b9f002bc37c3322eaf0b/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "457c7522-f9c8-5ced-a492-7e6b80cf814d",
//         "title": "NVIDIA HP GTX 1660 6GB - Working",
//         "url": "https://www.jawa.gg/product/91885/nvidia-hp-gtx-1660-6gb-working",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-3b4dd87f09751df15dfc8bf4722fe80b/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "Freshly repasted and fully tested \u2013 runs great. Perfect budget-friendly GPU for 1080p gaming or upgrading an older system.\n\nSpecs:\n6GB GDDR6 VRAM\nOEM HP Model (L34255-001)\nCleaned and working pull.\nComes in anti-static bag.\nTakes a single 8 Pin PCIe connector. \n\nFeel free to ask any questions. Will be shipped promptly and packaged safely - package insured. \n\nCONUS Only at listed price - buyers outside must talk through chat to discuss extra shipping fee.",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-3b4dd87f09751df15dfc8bf4722fe80b/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-56ffa416872ee2dec994c3d589936f00/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "10.00"
//     },
//     {
//         "uuid": "88e6eb0c-147b-5b7f-85b1-3cb824a682a3",
//         "title": "White Gaming PC \u2013 RTX 3070, Ryzen 7 3700X, 32GB, 1TB SSD - RGB, WiFi, BlueTooth",
//         "url": "https://www.jawa.gg/product/91513/white-gaming-pc-rtx-3070-ryzen-7-3700x-32gb-1tb-ssd-rgb-wifi-bluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-33fe7a0b2b0b515b2141ba462c670210/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. This PC is ideal for 1080P or 1440P Gaming. All drivers and updates have been freshly installed. Feel free to ask any questions! \n\n**Make sure to use code 'welcome10' to save $10 off your first order on Jawa!**\n\n---\n\n- ARGB Control via software\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** Zotac Gaming RTX 3070 8GB\n\n**-Processor (CPU):** AMD Ryzen 7 3700X 8 Cores 16 Threads 4.4GHz\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** G.SKILL 32GB 3200MHz DDR4\n\n**-Motherboard:** ASRock B450M Gaming\n\n**-PSU (Power Supply):** RaidMax Cobra 650W 80+ Gold Certified\n\n**-Case:** ZALMAN P10 MATX ARGB with Thermalright Frozen Notte 240MM AIO\n\n\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=ObWx6NcE1Ws\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come double-boxed to ensure they arrive in perfect condition.\nShipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nNotes:\n- Tempered glass side panel included\n-  Fully stress tested and running as expected\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-33fe7a0b2b0b515b2141ba462c670210/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-a0d3d6277fbe69029aafd699b5ae82f0/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-76cbe1c6b8baf18f963e9bf9b516fc11/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2bdb7041f0a4652f0e52f3e11042b115/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-f9a4ed448a0d423c74c216980bf2481f/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-3414f12d9b6672e80113fe0616c811c6/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-9c7e7740edb4f9a0d8a03bbe1c067bae/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-df4227971287c2c800afbea403b01957/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "8c7fb358-d87a-50cd-b8e5-47ddce5fa112",
//         "title": "Powerful Black Gaming PC \u2013 RTX 2080, Intel i7 9700F, 16GB DDR4, 1TB NVMe SSD - RGB/WiFi/BlueTooth",
//         "url": "https://www.jawa.gg/product/90631/powerful-black-gaming-pc-rtx-2080-intel-i7-9700f-16gb-ddr4-1tb-nvme-ssd-rgbwifibluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-59d6fee1fca5cc4990d0c466551f8bc7/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 2080 will push high frame rates in e-sports and triple A titles, while not breaking the bank. Raw performance is similar to an RTX 3060 8GB. \n\n\n**Make sure to use code 'welcome10' to save $10 off your first order on Jawa!**\n\n---\n\n- ARGB Control via button/software \n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** ASUS DUAL RTX 2080 8GB \n\n**-Processor (CPU):** Intel Core i7 9700F 8 Cores 8 Threads\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** Neo Forza 16GB DDR4\n\n**-Motherboard:**  ASRock B365 BM \n\n**-PSU (Power Supply):** MSI Mag A550BN 80+ Bronze Certified\n\n**-Case:** Aigo C275P MicroATX w/ 4X ARGB fans\n\n**-Operating System (OS):** Windows 11 Home (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=dhvXrD9Rk0U\n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-59d6fee1fca5cc4990d0c466551f8bc7/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-c3710ec63a4ab0d4bf319900332187db/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-533085e7a2ef6d3de3f1f90646670d9a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-1f0d3654e597fd13b32bf330211e528c/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-e14d65f9299ba014a19323b204e2da00/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-0bdf42d51a8b3f5ecbb24061781e8dad/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2c3ed20a1375ae22fd67a7fbf63a9b02/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "4194ace4-461e-5973-aabd-eccefff86b0b",
//         "title": "Powerful White Gaming PC \u2013 RTX 5060, Ryzen 5 5600X, 32GB, 1TB SSD - RGB, WiFi, BlueTooth",
//         "url": "https://www.jawa.gg/product/90659/powerful-white-gaming-pc-rtx-5060-ryzen-5-5600x-32gb-1tb-ssd-rgb-wifi-bluetooth",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-5d0e699436b71aa09f4afbb9ea59b870/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "This custom-built, plug and play desktop is ready to handle modern games, editing, and streaming with ease. The RTX 5060 has all new DLSS 4.0 features, AV1 encoding support, and Nvidia Reflex/Broadcast features. Plug and play out of the box, ships within 2 days. \n\n\n**Make sure to use code 'welcome10' to save $10 off your first order on Jawa!**\n\n---\n\n- ARGB Control via controller button\n- All drivers and updates have been installed\n- Wi-Fi + Bluetooth is built in\n- Stressed tested before shipping out\n\n---\n\n**Specifications**\n\n**-Graphics Card (GPU):** ASUS PRIME RTX 5060 8GB w/ 3X Fans\n\n**-Processor (CPU):** AMD Ryzen 5 5600X 6 Cores 12 Threads 4.6GHz\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe\n\n**-Memory (RAM):** G.SKILL RIPJAWS 32GB (2x16GB) 3600Mhz\n\n**-Motherboard:**  ASUS TUF Gaming X570 (WiFI) ATX\n\n**-PSU (Power Supply):** High Power HP1 600W 80+ Gold (B Tier)\n\n**-Case:** SAMA SV02 ATX w/ 3X ARGB Fans\n\n**-Operating System (OS):** Windows 11 Pro (Activated), feel free to request Windows 10\n\n**-WIFI (internet):** WIFI 5 included + Bluetooth\n\n---\n\nGaming Benchmarks : https://www.youtube.com/watch?v=Pg8m9G5onuc \n\nIf you need estimates for a different game, let me know through chat. \n\n---\n\n**All computers I sell come double-boxed to ensure they arrive in perfect condition.\nShipping insurance included for peace of mind, along with lifetime technical support. PC is plug and play out of the box.**\n\n\n---\n\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas\ud83d\udedc\n\nWill be shipped out as quickly as possible!\n\nShipping is only available to buyers in the CONUS, sorry. If you are dead set on a PC and are located in Alaska or Hawaii, please send a message to estimate how much an extra shipping charge will cost. \n\n---\n\nThanks for viewing my listing!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-5d0e699436b71aa09f4afbb9ea59b870/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-be4300dd368d9438904dd049476b9de1/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-d864fe5dd730d26c58806c22723e114a/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-2628fa84482dceeae7ef1f6251a27175/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-791990a5c067ad07bbf451a2576c6853/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-0780404dfdfaf39afb076f2b9ce89ad5/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-48557ff8e449fb421812c0b2fb2bc28d/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-95f07d1e62fd7a8042f6e61491d876a1/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-59a3e48a51338e47f8f09fdb09910046/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-6bcf65f184b0c62db77ec721bc4a32ec/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     },
//     {
//         "uuid": "85a82957-8252-5f19-b0f5-36f971cd8b50",
//         "title": "\u2744\ufe0f1440P Gaming PC\u2744\ufe0f  - RTX 3080 Vision, Ryzen 7 5800X, 32GB DDR4, 1TB NVMe",
//         "url": "https://www.jawa.gg/product/87690/1440p-gaming-pc-rtx-3080-vision-ryzen-7-5800x-32gb-ddr4-1tb-nvme",
//         "thumbnail_url": "https://www.jawa.gg/images/production-listing-9f2befb3c22fe8ea52ded3aa7ad46731/width=2048,height=1536,quality=85,format=auto,fit=cover",
//         "price": "N/A",
//         "sold_out": true,
//         "description": "Plug-and-Play Gaming PC for Sale \u2013 Ready for 1440P Gaming! \ud83d\udd14New user? Get $10 OFF today by entering WELCOME10 in checkout!\n\n---\nThis is a high-end gaming/streaming/AI/Content creation beast that will run anything you throw at it. It has RGB, two glass panels, and a white theme. This PC has the RTX 3080, a great GPU perfect for 1440P Gaming. \n\n**Specifications**\n\n**-Graphics Card (GPU):** Gigabyte Vision White NVIDIA RTX 3080 10GB \n\n**-Processor (CPU):** AMD Ryzen 7 5800X 8C 16T 4.7Ghz\n\n**-Solid-State Drive (SSD):** SP A60 1TB NVMe SSD\n\n**-Memory (RAM):** Corsair Vengeance RGB 3200Mhz 32GB DDR4\n\n**-Motherboard:** ASUS STRIX X570-E GAMING WiFi\n\n**-CPU Cooler:** Thermalright FW360 Ultra ARGB\n\n**-Case:** SAMA SV01 ATX PC case w/ 7x Infinity Fans\n\n**-Power Supply (PSU):** High Power HP1 850W 80+ Gold (B tier)\n\n**-Operating System (OS):** Windows 11 Pro Activated\n\n---\n**GPU Performance Benchmarks** \n\nhttps://www.youtube.com/watch?v=jico3AfE2fg&t=2s\n\n---\n**\ud83d\udce6 What's included in the box? \ud83d\udce6**\n\n1x Gaming PC \ud83c\udfae\n\n1x PC Power Cable \ud83d\udd0c\n\n2x Wi-Fi Antennas \ud83d\udedc\n\n---\nFor general gaming performance, you can search \u201cRTX 3080 and Ryzen 7 5800X\u201d on YouTube for similar benchmarks.\n\n**Shipping is only available at listed price to CONUS. If you are in Hawaii or Alaska, please DM for information regarding shipping costs**\n\nFeel free to reach out with any questions!",
//         "images": [
//             "https://www.jawa.gg/images/production-listing-9f2befb3c22fe8ea52ded3aa7ad46731/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-6cc55190d84ff7223eb4d22718b03c15/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-5177eb6902829955174158df88c83179/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-7591a86dbb84d8c480e8e1087e260987/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-b609ba575c0745d0555deecfe8a0d3b2/width=2048,height=1536,quality=90,format=auto,fit=cover",
//             "https://www.jawa.gg/images/production-listing-9b9f2543b1066030f54560a67d2621e8/width=2048,height=1536,quality=90,format=auto,fit=cover"
//         ],
//         "shipping_cost": "65.00"
//     }
// ]
    });
</script>

<div class="page-container">
    <div class="listings-grid">
        {#each (listings ?? []) as listing}
            <a class="listing-card" href="/shop/{listing.uuid}">
                <div class="image-container">
                    <img src="{listing.thumbnail_url}" alt="{listing.title}" />
                </div>
                <div class="info-container">
                    <div class="title">{listing.title}</div>
                    {#if !listing.sold_out}
                        <div class="price">{listing.price}</div>
                    {:else}
                        <div class="price sold-out"><em>Sold Out</em></div>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "/static/scss/global.scss" as g;

    .page-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 1rem;
        background-color: g.$dark;
        color: g.$light;
    }

    .listings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;

        .listing-card {
            display: flex;
            flex-direction: column;
            background-color: #252525;
            padding: 1rem;
            text-decoration: none;
            border-radius: 1rem;
            gap: 0.5rem;

            .image-container {
                img {
                    width: 100%;
                    border-radius: 1rem;
                }
            }

            .info-container {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;

                .title, .price {
                    text-align: left;
                    border-radius: 0.5rem;
                    padding-block: 0.3rem;
                    font-weight: bold;
                    font-size: 1rem;
                    color: g.$light;
                }

                .title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .price {
                    color: lighten(g.$primary, 10%);
                }

                &.sold-out {
                    opacity: 0.5;
                }
            }
        }
    }
</style>
