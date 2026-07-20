<div align="center">

# 🚀 LatinChain Platform
### The Premier Web3 Gaming Ecosystem on Pi Network

[![Pi Network](https://img.shields.io/badge/Pi_Network-Mainnet_Ready-purple.svg)](https://minepi.com/)
[![Pi Hackathon Winner](https://img.shields.io/badge/Pi_Hackathon_2021-Honorable_Mention-gold.svg)](https://minepi.com/blog/hackathon-winners-announcement)
[![Odoo Version](https://img.shields.io/badge/Odoo-13.0%20%7C%2014.0-blue.svg)](https://apps.odoo.com/)
[![License](https://img.shields.io/badge/License-PiOS-green.svg)](#license)

*Bringing interactive gaming and seamless Pi cryptocurrency integration to millions of Pioneers worldwide.*

[Live Platform](https://latin-chain.com) • [App Presentation](https://www.youtube.com/watch?v=9KqcyAoCZzo) • [Developer Portal](https://developers.minepi.com/)

---

</div>

## 📖 About LatinChain

**LatinChain** is a decentralized gaming engine and app platform built specifically for the **Pi Network** ecosystem. Recognized as an **Honorable Mention Winner in the Pi Hackathon 2021**, LatinChain enables Pioneers to authenticate smoothly and use Pi for fast, secure in-game transactions and micro-payments via the Pi SDK.

> 📢 *Trademarks Notice: Pi, Pi Network, and the Pi logo are official trademarks of the Pi Community Company.*

---

## 🔥 Featured Games & Apps

LatinChain powers a suite of classic and engaging games integrated directly with Pi authentication and payments:

* 🧩 **Pidoku** – Sudoku powered by Pi rewards.
* 🐍 **Snake** – Classic Snake game with competitive challenges.
* ♟️ **Chess** – Turn-based strategic game supporting Pioneer matches.
* ⚡ **App Example for Pi** – Reference implementation for developers building on Pi SDK.

---

## 🛠️ Tech Stack & Architecture

LatinChain is built on top of **Odoo ERP Framework**, providing scalable modular backend capabilities for managing platform assets, users, and transactions.

* **Backend Framework:** Odoo 13.0 / 14.0
* **Frontend Integration:** Pi SDK v2.0 (JavaScript / HTML5 Engine)
* **Hosting:** Configurable for HTTP Servers supporting domain/subdomain routing.

### Platform Modules:
1. **`website_pinetwork_odoo`** *(PiOS License)* – Core LatinChain integration and base platform logic.
2. **`website_pinetwork_games_odoo`** *(PiOS License)* – Specialized Games Engine and platform management module.

---

## 🚀 Sandbox & Local Setup Guide

To run and test LatinChain source codes using the [Pi Developer Sandbox](https://developers.minepi.com/):

1. **Deploy to HTTP Server:** 
   Place the source files in the root directory of your web server (Apache/Nginx/Odoo Server). Domains and subdomains are fully supported.

2. **Configure Pi SDK Sandbox Mode:**
   Ensure `sandbox: true` is enabled in your client-side initialization snippet:

   ```html
   <script src="[https://sdk.minepi.com/pi-sdk.js](https://sdk.minepi.com/pi-sdk.js)"></script>
   <script>
     Pi.init({ version: "2.0", sandbox: true });
   </script>
   3. **Run Odoo Modules:**  
   Install and run the modules on an active **Odoo 13.0** or **14.0** instance.

---

## 🔗 Official Links & Resources

* 🌐 **Live Website:** [latin-chain.com](https://latin-chain.com)
* 📹 **Video Demo & Final Presentation:** [Watch on YouTube](https://www.youtube.com/watch?v=9KqcyAoCZzo)
* 📦 **Odoo App Store (Core Platform):** [website_pinetwork_odoo](https://apps.odoo.com/apps/modules/14.0/website_pinetwork_odoo/)
* 🎮 **Odoo App Store (Games Engine):** [website_pinetwork_games_odoo](https://apps.odoo.com/apps/modules/14.0/website_pinetwork_games_odoo/)
* 📝 **Development Blog Post:** [Read Info & Update History](https://dev-rockcesar.blogspot.com/2021/05/pi-apps-published.html)

---

## 🏛️ Repositories & Attribution

* **Current Main Repository:** [EslaM-X/LatinChain](https://github.com/EslaM-X/LatinChain)
* **Original Repository:** [rockcesar/LatinChainDevelopments](https://github.com/rockcesar/LatinChainDevelopments)
* **Institutional Repository:** [rockcesar/LatinChainDevelops](https://github.com/rockcesar/LatinChainDevelops)

---

## 📜 License

This project is open-sourced under the **PiOS (Pi Open Source) License**. See individual module directories for specific licensing conditions.