# Equiti Gate Database Schema

## Overview

The Equiti Gate database stores all information required to operate the global real estate ecosystem.

The database must support:

- Investors
- Properties
- Investments
- Payments
- Rewards
- Withdrawals
- Property operations
- Platform management

---

# 1. Users Table

## Purpose

Stores all platform users.

## Fields

### id
Unique user identifier.

### full_name
User's legal name.

### email
User email address.

### phone_number
User phone number.

### country
User country.

### password_hash
Encrypted password.

### account_type

Possible values:

- Investor
- Property Owner
- Administrator

### verification_status

Possible values:

- Pending
- Verified
- Suspended

### created_at

Account creation date.

### updated_at

Last profile update.

---

# 2. Investment Plans Table

## Purpose

Stores available investment options.

## Fields

### id

Unique plan identifier.

### name

Examples:

- Foundation
- Growth
- Legacy

### minimum_amount

Minimum investment required.

### maximum_amount

Maximum allowed investment.

### investment_limit

Maximum number of active investments allowed per user.

### duration

Investment period.

### return_structure

Defines how earnings are calculated.

### status

Active or inactive.

---

# 3. Investments Table

## Purpose

Stores user investments.

## Fields

### id

Investment identifier.

### user_id

Links investment to user.

### property_id

Links investment to property.

### plan_id

Selected investment plan.

### amount

Amount invested.

### start_date

Investment start date.

### end_date

Investment completion date.

### status

Possible values:

- Active
- Completed
- Cancelled

### earnings

Recorded earnings.

---

# 4. Properties Table

## Purpose

Stores real estate projects.

## Fields

### id

Property identifier.

### name

Property name.

### country

Property country.

### city

Property location.

### type

Examples:

- Airbnb
- Apartment
- Commercial

### description

Property details.

### images

Property photos.

### investment_target

Required funding amount.

### current_funding

Amount raised.

### status

Possible values:

- Funding
- Construction
- Active
- Completed

---

# 5. Wallets Table

## Purpose

Stores user financial balances.

## Fields

### id

Wallet identifier.

### user_id

Wallet owner.

### available_balance

Available funds.

### investment_balance

Money currently invested.

### reward_balance

Earned rewards.

### currency

Examples:

- USD
- EUR
- UGX

---

# 6. Transactions Table

## Purpose

Records all financial activity.

## Fields

### id

Transaction identifier.

### user_id

User involved.

### type

Examples:

- Deposit
- Investment
- Withdrawal
- Reward

### amount

Transaction amount.

### payment_method

Examples:

- Crypto
- Mobile Money
- Bank

### status

Possible values:

- Pending
- Completed
- Failed

### created_at

Transaction date.

---

# 7. Withdrawals Table

## Purpose

Manages withdrawal requests.

## Fields

### id

Withdrawal identifier.

### user_id

Requesting user.

### amount

Requested amount.

### method

Withdrawal method.

### status

Possible values:

- Pending
- Approved
- Rejected
- Completed

### requested_at

Request date.

---

# 8. Rewards Table

## Purpose

Stores user rewards.

## Fields

### id

Reward identifier.

### user_id

Reward recipient.

### type

Examples:

- Advertisement
- Referral
- Promotion

### amount

Reward value.

### status

Pending or credited.

### created_at

Reward date.

---

# 9. Advertisements Table

## Purpose

Stores advertisements available for users.

## Fields

### id

Advertisement identifier.

### title

Advertisement name.

### company

Advertiser.

### duration

Viewing duration.

### reward_amount

Reward per completed view.

### daily_limit

Maximum views allowed.

### status

Active or inactive.

---

# 10. Advertisement Views Table

## Purpose

Tracks advertisement activity.

## Fields

### id

Record identifier.

### user_id

Viewer.

### advertisement_id

Viewed advertisement.

### completed

Whether viewing was completed.

### reward_given

Whether reward was issued.

### viewed_at

View date.

---

# 11. Notifications Table

## Purpose

Stores platform messages.

## Fields

### id

Notification identifier.

### user_id

Recipient.

### title

Notification title.

### message

Notification content.

### read_status

Read or unread.

### created_at

Date created.

---

# Database Relationships

User:
- Has many investments
- Has one wallet
- Has many transactions
- Has many rewards
- Has many notifications

Property:
- Has many investments

Investment Plan:
- Has many investments

Advertisement:
- Has many advertisement views

---

# Database Security Requirements

The system must include:

- User data protection
- Access permissions
- Encrypted sensitive information
- Activity logging
- Backup procedures
