use anchor_lang::prelude::*;

declare_id!("7dhGUjyoV2WrBXETpb9qFV6H37YYpEXAdmSKydP9EJgF");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<InitializeNumber>) -> Result<()> {
        let number_account = &mut ctx.accounts.number_account;
        number_account.value = 0;
        msg!("Initialised");
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>, by_amount: u64) -> Result<()> {
        let number_account = &mut ctx.accounts.number_account;
        if by_amount < 2 {
            number_account.value += 1;
        } else if by_amount > 10 {
            return Err(ModifierTooLarge::TooLg.into());
        } else {
            number_account.value += by_amount;
        }
        msg!("Incremented {}", number_account.value);
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>, by_amount: u64) -> Result<()> {
        let number_account = &mut ctx.accounts.number_account;
        if by_amount < 2 {
            number_account.value -= 1;
        } else if by_amount > 10 {
            return  Err(ModifierTooLarge::TooLg.into());
        } else {
            number_account.value -= by_amount;
        }
        msg!("Decremented {}", number_account.value);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub number_account: Account<'info, NumberAccount>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub number_account: Account<'info, NumberAccount>,
}

#[derive(Accounts)]
pub struct InitializeNumber<'info> {
    #[account(init, payer = authority, space = 8 + 64)]
    pub number_account: Account<'info, NumberAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NumberAccount {
    value: u64,
}

// Error handling
#[error_code]
    pub enum ModifierTooLarge {
    #[msg("Modifier is too large, can only between 1-10")]
    TooLg,
}