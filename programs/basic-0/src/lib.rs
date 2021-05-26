use anchor_lang::prelude::*;

#[program]
mod basic_0 {
    use super::*;
    pub fn initialize_market(_ctx: Context<InitializeMarket>) -> ProgramResult {
        msg!("Initializing market!");
        Ok(())
    }
    pub fn initialize_trove(_ctx: Context<InitializeTrove>) -> ProgramResult {
        msg!("Initializing trove!");
        Ok(())
    }
    pub fn deposit_trove_sol(_ctx: Context<DepositTroveSOL>) -> ProgramResult {
        msg!("Depositing Sol to trove!");
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
        msg!("Staking USd!");
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
pub struct InitializeMarket {}

/// Initializes a new trove, assigning it an owner
#[derive(Accounts)]
pub struct InitializeTrove {}

/// Deposit collateral to your trove to be able to borrow
#[derive(Accounts)]
pub struct DepositTroveSOL {}

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
