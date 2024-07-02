# UI Elements

## Owner Flow
    1. **Tokenize**: Real Estate (House)
        - via `RealEstate.sol`
        - transacts on the issue() function
    2. **View**: House Data
        - view key data for a gien house.
        - pulls from contract or API

## Renter Flow
    1. **View**: House Listings
        - key data (on house)
        - rental rate
        - etc.
    2. **Rent**: Transaction to Rent
        - pay first month
        - `rent(uint id)`