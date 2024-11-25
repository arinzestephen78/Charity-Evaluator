# Charity Registry and Donation Tracker

## Overview
Stacks blockchain smart contracts for registering charities, tracking donations, and managing charity transparency.

## Charity Registry Contract

### Features
- Charity registration
- Charity information storage
- Transparency score management

### Key Functions
- `register-charity`: Add new charity
- `get-charity`: Retrieve charity details
- `update-transparency-score`: Modify charity transparency rating

### Data Structure
Charity attributes:
- Name
- Description
- Wallet address
- Total donations
- Transparency score

## Donation Tracker Contract

### Features
- Donation recording
- Donation lookup
- Total donation tracking

### Key Functions
- `record-donation`: Log individual donations
- `get-donation`: Retrieve specific donation details
- `get-total-donations`: Check total donations for a charity

## Error Handling
- Input validation
- Non-existent charity checks
- Score range restrictions

## Security Considerations
- Wallet-based authentication
- Donation tracking integrity
- Transparency score management

## Potential Improvements
- Donation withdrawal mechanism
- More advanced transparency scoring
- Donor reputation system
