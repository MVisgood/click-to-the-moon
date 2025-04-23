use anchor_lang::prelude::*;

declare_id!("6z8nPrtCLEfJW3ptRTXQHtBfNGMqSKSFJCsNofZRG5dK");

#[program]
pub mod click_moon {
    use super::*;

    /// Creates (or re-initialises) *this wallet’s* counter to 0.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.state.count = 0;
        Ok(())
    }

    /// Increments *this wallet’s* counter by 1.
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.state.count = ctx
            .accounts
            .state
            .count
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        Ok(())
    }
}

/* ────────────────────────────────
   ACCOUNT CONTEXTS
   ─────────────────────────────── */

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// PDA seed = ["rocket_state", authority]
    #[account(
        init,
        payer = authority,
        space = 8 /*discriminator*/ + 8 /*u64 count*/,
        seeds = [b"rocket_state", authority.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    /// Same PDA seeds as Initialize
    #[account(
        mut,
        seeds = [b"rocket_state", authority.key().as_ref()],
        bump
    )]
    pub state: Account<'info, State>,

    /// Wallet that owns this counter
    pub authority: Signer<'info>,
}

/* ────────────────────────────────
   DATA STRUCTS
   ─────────────────────────────── */

#[account]
pub struct State {
    pub count: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter overflowed u64.")]
    MathOverflow,
}
