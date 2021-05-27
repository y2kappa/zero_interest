use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, TokenAccount, Transfer};

#[program]
mod basic_0 {
    use std::ops::{Deref, DerefMut};

    use super::*;
    pub fn initialize_market(ctx: Context<InitializeMarket>, owner: Pubkey) -> ProgramResult {
        msg!("Initializing market!");
        let lending_market_account = &mut ctx.accounts.lending_market_account;
        let liquidity_currency_mint = &ctx.accounts.liquidity_currency_mint;
        let token_program = &ctx.accounts.token_program;

        msg!(
            "Lending Market Account {:?}",
            lending_market_account.to_account_info()
        );
        msg!(
            "Liquidity Currency Mint {:?} {:?}",
            liquidity_currency_mint.to_account_info(),
            liquidity_currency_mint.deref().deref()
        );
        msg!("Token Program {:?}", token_program);

        lending_market_account.version = 0;
        lending_market_account.bump_seed = Pubkey::find_program_address(
            &[lending_market_account.to_account_info().key.as_ref()],
            ctx.program_id,
        )
        .1;
        lending_market_account.token_program_id = *token_program.to_account_info().key;
        lending_market_account.liquidity_token_mint =
            *liquidity_currency_mint.to_account_info().key;
        lending_market_account.owner = owner;

        msg!(
            "Lending Market Account {:?}",
            (lending_market_account.deref_mut())
        );

        Ok(())
    }
    pub fn initialize_trove(_ctx: Context<InitializeTrove>) -> ProgramResult {
        msg!("Initializing trove.");

        // let trove_account = &mut ctx.accounts.trove_data_account;

        // msg!("Trove data Account {:?}", (trove_account.deref_mut()));

        Ok(())
    }
    pub fn deposit_trove_sol(
        _ctx: Context<DepositTroveSOL>,
        sol_amount: u64,
        usd_amount: u64,
    ) -> ProgramResult {
        msg!(
            "Depositing SOL {} to trove in exchange of {}",
            sol_amount,
            usd_amount
        );
        Ok(())
    }
    pub fn borrow_trove_usd(_ctx: Context<BorrowTroveUSD>) -> ProgramResult {
        msg!("Borrowing usd from trove!");
        Ok(())
    }
    pub fn repay_trove_usd(_ctx: Context<RepayTroveUSD>) -> ProgramResult {
        msg!("Repaying trove with usd!");
        Ok(())
    }
    pub fn redeem_sol_trove_usd(_ctx: Context<RedeemSOLTroveUSD>) -> ProgramResult {
        msg!("Redeeming sol for usd!");
        Ok(())
    }
    pub fn stake_usd(_ctx: Context<StakeUSD>) -> ProgramResult {
        msg!("Staking USD for the liquidity/stability pool.");
        Ok(())
    }
    pub fn stake_zrx(_ctx: Context<StakeZRX>) -> ProgramResult {
        msg!("Staking ZRX!");
        Ok(())
    }
    pub fn liquidate_trove(_ctx: Context<LiquidateTrove>) -> ProgramResult {
        msg!("Liquidating trove!");
        Ok(())
    }
}

/// initialize Stability Pool
/// initialize WorldState Account
#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(init, rent_exempt)]
    pub lending_market_account: ProgramAccount<'info, LendingMarketAccount>,
    pub liquidity_currency_mint: CpiAccount<'info, Mint>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: AccountInfo<'info>,
}

#[account]
#[derive(Debug)]
pub struct LendingMarketAccount {
    pub version: u8,
    pub bump_seed: u8,
    pub owner: Pubkey,
    pub token_program_id: Pubkey,
    pub liquidity_token_mint: Pubkey,
    // TODO: add borrowing fee account (where fees go)
    // TODO: add baseRate
}

/// Initializes a new trove, assigning it an owner
#[derive(Accounts)]
pub struct InitializeTrove<'info> {
    #[account(init, rent_exempt)]
    pub trove_data_account: ProgramAccount<'info, TroveData>,
    #[account(signer)]
    pub owner: AccountInfo<'info>,
    #[account(signer)]
    pub authority: AccountInfo<'info>,
    pub lending_market_account: ProgramAccount<'info, LendingMarketAccount>,
    pub sol_source_account: AccountInfo<'info>,
    pub usd_destination_associated_account: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Debug)]
pub struct TroveData {
    pub version: u8,
    pub owner: Pubkey,
    pub deposited_trove_sol: Pubkey,
    pub associated_liqudity_token_account: Pubkey,
    pub deposited_sol: u64,
    pub borrowed_usd: u64,
}

/// Deposit collateral to your trove to be able to borrow
#[derive(Accounts)]
pub struct DepositTroveSOL<'info> {
    // TODO: add authority with signature
    #[account(mut)]
    pub trove_data_account: ProgramAccount<'info, TroveData>,
}

#[derive(Accounts)]
/// Borrow USD from your trove based on your SOL collateral
pub struct BorrowTroveUSD {}

/// Paying back your debt to be able to get back your SOL
#[derive(Accounts)]
pub struct RepayTroveUSD {}

/// For any amount of zUSD you can redeem USD worth of SOL
/// This is a mechanism to keep zUSD pegged to real USD
#[derive(Accounts)]
pub struct RedeemSOLTroveUSD {}

/// Staking USD for the stability pool to earn ZRX and SOL rewards
/// from fees and liquidations.
/// Essentially providing liquidity
#[derive(Accounts)]
pub struct StakeUSD {}

/// Staking ZRX to earn rewards from the borrowing and redemption fees
/// This is like buying shares into the system
#[derive(Accounts)]
pub struct StakeZRX {}

/// If a trove is under Minimum Collateral Ratio, it is liquidatable
/// by anyone. The liquidator will receive fees + some bonus back
/// This is an incentive to keep the system collateralized and the
/// zUSD fully backed by SOL
#[derive(Accounts)]
pub struct LiquidateTrove {}
