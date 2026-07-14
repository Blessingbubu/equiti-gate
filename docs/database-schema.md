# Equiti Gate Database Schema

## Overview

The database stores users, investments, properties, transactions, rewards, and platform operations.

---

# Table 1: Users

Stores investor accounts.

Fields:

id
- Unique user identifier

full_name
- Investor name

email
- Account email

phone
- Phone number

country
- Investor country

password
- Securely encrypted password

verification_status
- Pending
- Verified
- Rejected

wallet_balance
- Available funds

created_at
- Account creation date

---

# Table 2: Investment Plans

Stores available investment tiers.

Fields:

id

name

minimum_amount

maximum_investments_allowed

roi_percentage

investment_duration

status

Example:

Bronze
$15
8%

Silver
$50
11%

Gold
$150
15%

---

# Table 3: Investments

Stores individual investments.

Fields:

id

user_id

plan_id

amount

start_date

maturity_date

expected_return

status

Possible statuses:

Active
Completed
Withdrawn
Cancelled

---

# Table 4: Properties

Stores real estate projects.

Fields:

id

property_name

country

city

property_type

description

images

purchase_value

funding_target

current_funding

status

Possible statuses:

Funding
Construction
Active Rental
Completed

---

# Table 5: Transactions

Records money movement.

Fields:

id

user_id

transaction_type

amount

payment_method

status

created_at

Types:

Deposit
Investment
Withdrawal
Reward

---

# Table 6: Rewards

Stores earned rewards.

Fields:

id

user_id

reward_type

amount

source

created_at

Examples:

Advertisement reward

Referral reward

Promotion reward

---

# Table 7: Withdrawals

Handles withdrawal requests.

Fields:

id

user_id

amount

method

status

requested_at

processed_at

---

# Table 8: Advertisements

Stores reward advertisements.

Fields:

id

title

advertiser

reward_amount

daily_limit

status

---

# Table 9: Ad Views

Tracks users watching advertisements.

Fields:

id

user_id

advert_id

completed

reward_given

date

---

# Table 10: Notifications

Stores user messages.

Fields:

id

user_id

title

message

read_status

created_at