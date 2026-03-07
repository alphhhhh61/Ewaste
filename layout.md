# E-Waste Management & Recycling System - Application Layout

## 1. System Overview
The E-Waste Management & Recycling System is a web platform connecting users, collection centers, and administrators to efficiently manage electronic waste collection. It enables responsible disposal of e-waste while offering users monetary rewards (Recycling Credits) that accumulate in a digital wallet.

## 2. User Roles
- **User:** Can register devices, schedule pickups or drop-offs, and earn credits for recycled electronics.
- **Admin:** Monitors the platform, manages users and collection centers, oversees reward values, and processes user withdrawal requests.
- **Collection Center Staff:** Manages pickup operations, assigns pickup staff, and confirms device collection.

## 3. Main Navigation Structure
- Home
- About
- Register Device
- Collection Centers
- Schedule Pickup
- My Devices
- My Wallet
- Dashboard
- Contact / Support

## 4. Page Details & Layouts

### 4.1 Home Page
**Purpose:** Introduction and platform promotion.
- **Hero Section:**
  - Title: E-Waste Management & Recycling System
  - Tagline promoting responsible recycling
  - Call to Action Buttons: "Register Device", "Schedule Pickup"
- **Information Section:**
  - Educational content: "What is e-waste?", environmental impact, benefits of recycling.
- **Platform Highlights:**
  - Easy registration, free pickup, earn money.
- **Statistics Section:**
  - Live Counters: Total users, Devices collected, Total rewards paid.
- **Footer:**
  - Contact info, support links, policies.

### 4.2 User Registration and Login
**Purpose:** Secure account creation and management.
- **Registration Form:**
  - Name, Email address, Phone number, Address, Password.
- **Features:**
  - Secure login authentication, password recovery, profile settings.

### 4.3 User Dashboard
**Purpose:** Central hub for logged-in users.
- **Overview Panel:**
  - Total devices registered, devices picked up, wallet balance, pending requests.
- **Recent Activity:**
  - Newly registered devices, pickup confirmations, credit rewards.
- **Notifications:**
  - Pickup reminders, wallet updates, system announcements.

### 4.4 Register Device Page
**Purpose:** Input details of e-waste devices for recycling.
- **Form Fields:** Device category dropdown, brand, model name, device condition, approximate age, photo upload (optional).
- **Disposal Preference:** Home Pickup or Drop-off at a collection center.
- **Categories Allowed:** Mobile phones, Laptops, Tablets, Televisions, Printers, Computer accessories, Batteries.
- *System Action:* On form submission, generates a unique Device ID and stores information.

### 4.5 My Devices Page
**Purpose:** Tracking all registered devices.
- **Data Table:** Device ID, device name, category, registration date, pickup status, credit value.
- **Status Types:** Registered, Pickup Scheduled, Picked Up, Completed.

### 4.6 Collection Centers Page
**Purpose:** Locate nearby drop-off points.
- **Features:** Interactive map, location search, filter by device category.
- **Center Cards Display:** Center name, Address, Working hours, Contact number, Accepted device types.

### 4.7 Schedule Pickup Page
**Purpose:** Arrange for home collection of e-waste.
- **Pickup Form:** Select Device ID, pickup address, preferred date & time, special instructions.

### 4.8 My Wallet Page
**Purpose:** Manage financial rewards and withdrawals.
- **Wallet Information:** Total credits earned, available balance, withdrawal status, complete transaction history.
- **Withdrawal Rules:** Users can request payment only when reaching a minimum balance (e.g., ₹500).
- **Payment Methods:** UPI transfer, Bank transfer, Digital wallet payment.

### 4.9 Admin Dashboard
**Purpose:** Platform administration and system oversight.
- **Management Features:** 
  - Manage users and view all registered devices.
  - Approve pickup completion and process withdrawal requests.
  - Manage collection centers and global reward values.
- **Reports:** Total devices collected, total rewards paid, active users, collection statistics.

### 4.10 Collection Center Module
**Purpose:** Tracking pickup operations at the local center level.
- **Functions:** View local pickup requests, assign pickup staff, confirm device collection (which triggers credit allocation to the user).

## 5. High-Level Database Entities
The database stores all information required for system operation:
- **Users:** User profiles, authentication data, addresses.
- **Devices:** Registered device specifications, tracking ID, associated user ID.
- **Device Categories:** Permitted categories and their base credit values.
- **Collection Centers:** Location details, allowed categories, operational hours.
- **Pickup Requests:** Associated Device ID, scheduled date/time, status.
- **Wallet Accounts:** User balances.
- **Credit Transactions:** Credit earning history.
- **Withdrawal Requests:** Withdrawal amounts, chosen payment method, request status.

## 6. Complete Application Workflow

1. **User Registration:** User creates an account and logs in to the platform.
2. **Device Registration:** User enters the details of the electronic device they want to recycle. The system stores this and generates a Device ID.
3. **Choose Disposal Method:** User selects between Home Pickup and Center Drop-off.
4. **Pickup Request (If applicable):** User schedules a date and time. The collection center receives the request and assigns an agent.
5. **Pickup Confirmation:** The collection center confirms the device has been collected. Device status updates to 'Picked Up'.
6. **Credit Allocation:** The system calculates the reward value (e.g., Laptop -> ₹120) and adds it to the user's wallet.
7. **Credit Accumulation:** The user continues recycling to accumulate more credits over time.
8. **Minimum Balance Reached:** Once the wallet reaches the eligible withdrawal threshold (e.g., ₹500), the user can cash out.
9. **Withdrawal Request:** User submits a withdrawal request via the My Wallet page.
10. **Payment Processing:** Admin reviews and approves the withdrawal, transferring real money via UPI/Bank transfer.
11. **Transaction Completion:** The user's wallet balance updates and the payout is recorded in the database.
