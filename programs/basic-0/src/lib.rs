use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::lamports_to_sol;
use anchor_lang::solana_program::system_program;
use anchor_spl::token::{self, Burn, Mint, MintTo, TokenAccount, Transfer};
pub use spl_token::ID;

#[program]
mod basic_0 {
    use std::ops::{Deref, DerefMut};

    use super::*;
    pub fn initialize_market(ctx: Context<InitializeMarket>, owner: Pubkey) -> ProgramResult {
        // TODO:
        // https://github.com/project-serum/anchor/commit/dd64779273ab441fb40e617e1dd120d5a5559307#diff-43fffbeff5b448207741b2bd0e9a4872347c17dcb5eb7cf655aedd1e519349a2R70
        // Ensure you can set authority to the stablecoin account for the market so it can mint tokens

        msg!("Initializing market!");
        let lending_market_account = &mut ctx.accounts.lending_market_account;
        let stablecoin_mint = &ctx.accounts.stablecoin_mint;
        let token_program = &ctx.accounts.token_program;

        msg!(
            "Lending Market Account {:?}",
            lending_market_account.to_account_info()
        );
        msg!(
            "Liquidity Currency Mint {:?} {:?}",
            stablecoin_mint.to_account_info(),
            stablecoin_mint.deref().deref()
        );
        msg!("Token Program {:?}", token_program);

        lending_market_account.version = 0;
        lending_market_account.bump_seed = Pubkey::find_program_address(
            &[lending_market_account.to_account_info().key.as_ref()],
            ctx.program_id,
        )
        .1;
        lending_market_account.token_program_id = *token_program.to_account_info().key;
        lending_market_account.liquidity_token_mint = *stablecoin_mint.to_account_info().key;
        lending_market_account.owner = owner;

        msg!(
            "Lending Market Account {:?}",
            (lending_market_account.deref_mut())
        );

        Ok(())
    }
    pub fn trove_initialize(ctx: Context<TroveInitialize>) -> ProgramResult {
        // Initialize trove data with references (pubkeys) to all accounts
        // from and into which tokens will be transferred

        msg!("Initializing trove.");

        let trove_data_account = &mut ctx.accounts.trove_data_account;
        let owner = &ctx.accounts.owner;
        let stablecoin_account = &ctx.accounts.stablecoin_destination_associated_account;
        let sol_escrow_account = &ctx.accounts.sol_escrow_account;

        trove_data_account.version = 0;
        trove_data_account.owner = *owner.to_account_info().key;
        trove_data_account.sol_source_account = *owner.to_account_info().key;
        trove_data_account.sol_escrow_account = *sol_escrow_account.to_account_info().key;
        trove_data_account.stablecoin_destination_associated_account =
            *stablecoin_account.to_account_info().key;
        trove_data_account.deposited_sol = 0;
        trove_data_account.borrowed_usd = 0;

        msg!("Trove data Account {:?}", (trove_data_account.deref_mut()));

        Ok(())
    }
    pub fn trove_transfer(
        ctx: Context<TroveTransfer>,
        deposit_sol_amount: u64,
        borrow_stable_amount: u64,
    ) -> ProgramResult {
        let owner = &mut ctx.accounts.owner;
        let to = &mut ctx.accounts.to;

        // **owner.to_account_info().lamports.borrow_mut() -= 2;
        // **to.to_account_info().lamports.borrow_mut() += 2;

        // let cpi_accounts = Transfer {
        //     from: owner.to_account_info().clone(),
        //     to: to.clone(),
        //     authority: owner.to_account_info().clone(),
        // };

        // let amount = 2;

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &owner.to_account_info().key,
            &to.to_account_info().key,
            20,
        );

        let res = anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                owner.to_account_info().clone(),
                to.to_account_info().clone(),
                ctx.accounts.system_program.clone(),
            ],
        )?;

        // let cpi_ctx = CpiContext::new(system_program::id(), cpi_accounts);
        // let res = token::transfer(cpi_ctx, amount);
        msg!("Result {:?}", res);

        Ok(())
    }

    pub fn trove_borrow(
        ctx: Context<TroveBorrow>,
        deposit_sol_amount: u64,
        borrow_stable_amount: u64,
    ) -> ProgramResult {
        // let trove_data_account = &mut ctx.accounts.trove_data_account;
        // let owner_account = &ctx.accounts.owner;
        // let sol_escrow_account = &ctx.accounts.sol_escrow_account;
        // let sol_in_account = lamports_to_sol(owner_account.to_account_info().lamports());
        // msg!(
        //     "Depositing SOL {} to trove in exchange of {} stablecoin",
        //     deposit_sol_amount,
        //     borrow_stable_amount
        // );

        // msg!("Trove Data Account {:?}", (trove_data_account.deref_mut()));
        // msg!(
        //     "Owner has {} SOL in Account {:?} ",
        //     sol_in_account,
        //     (owner_account.to_account_info())
        // );

        // TODO: ensure sol_escrow_account == trove_data_account.sol_escrow_account

        // 1. Transfer from owner to escrow
        // 2. Mint from Stablecoin Mint to Associated Stable account

        // Transfer funds to the check.
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info().clone(),
            to: ctx.accounts.vault.to_account_info().clone(),
            authority: ctx.accounts.owner.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        let res = token::transfer(cpi_ctx, 2)?;

        // // 1.
        // let cpi_accounts = Transfer {
        //     from: owner_account.to_account_info().clone(),
        //     to: sol_escrow_account.clone(),
        //     authority: owner_account.to_account_info().clone(),
        // };

        // let amount = 2;
        // let cpi_program = ctx.accounts.token_program.clone();

        // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        // let res = token::transfer(cpi_ctx, amount);
        msg!("Result {:?}", res);

        Ok(())
    }
    // pub fn borrow_trove_usd(_ctx: Context<BorrowTroveUSD>) -> ProgramResult {
    //     msg!("Borrowing usd from trove!");
    //     Ok(())
    // }
    // pub fn repay_trove_usd(_ctx: Context<RepayTroveUSD>) -> ProgramResult {
    //     msg!("Repaying trove with usd!");
    //     Ok(())
    // }
    // pub fn redeem_sol_trove_usd(_ctx: Context<RedeemSOLTroveUSD>) -> ProgramResult {
    //     msg!("Redeeming sol for usd!");
    //     Ok(())
    // }
    // pub fn stake_usd(_ctx: Context<StakeUSD>) -> ProgramResult {
    //     msg!("Staking USD for the liquidity/stability pool.");
    //     Ok(())
    // }
    // pub fn stake_zrx(_ctx: Context<StakeZRX>) -> ProgramResult {
    //     msg!("Staking ZRX!");
    //     Ok(())
    // }
    // pub fn liquidate_trove(_ctx: Context<LiquidateTrove>) -> ProgramResult {
    //     msg!("Liquidating trove!");
    //     Ok(())
    // }
}

/// initialize Stability Pool
/// initialize WorldState Account
#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(init, rent_exempt)]
    pub lending_market_account: ProgramAccount<'info, LendingMarketAccount>,
    pub stablecoin_mint: CpiAccount<'info, Mint>,
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
pub struct TroveInitialize<'info> {
    #[account(init, rent_exempt)]
    pub trove_data_account: ProgramAccount<'info, TroveData>,

    #[account(signer)]
    pub owner: AccountInfo<'info>,

    // TODO: Still don't know how to use this correctly
    #[account(signer)]
    pub authority: AccountInfo<'info>,

    // Global data account with info such as baseRate, MCR, etc
    pub lending_market_account: ProgramAccount<'info, LendingMarketAccount>,

    // Source of the deposit of SOL, an where SOL will be returned
    // after the debt is paid back
    pub sol_source_account: AccountInfo<'info>,

    // New account where the sol will be temporarily locked while the
    // trove is active and has debt
    #[account(init, rent_exempt)]
    pub sol_escrow_account: ProgramAccount<'info, TroveCollateralAccount>,

    // Account where stablecoin will be "lent to" or "minted to"
    pub stablecoin_destination_associated_account: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}

// 1 + 32 + 32 + 32 + 32 + 8 + 8 = 145
#[account]
#[derive(Debug)]
pub struct TroveData {
    pub version: u8,

    // Main user, signer
    pub owner: Pubkey,

    // Where the SOL is coming from (Borrower)
    pub sol_source_account: Pubkey,

    // Escrow account where the SOL is deposited (locked)
    // and owned by the program which only the program can
    // release after the debt was paid back or redeemed or
    // in case of a liquidation
    pub sol_escrow_account: Pubkey,

    // User owned account, where the stablecoin will be minted
    // when the user borrows some agains their SOL collateral
    pub stablecoin_destination_associated_account: Pubkey,

    // TODO: make this u128 and implement the decimal logic
    pub deposited_sol: u64,
    // TODO: make this u128 and implement the decimal logic
    pub borrowed_usd: u64,
}

#[account]
#[derive(Debug)]
pub struct TroveCollateralAccount {
    data: u8,
}

/// Deposit collateral to your trove to be able to borrow
#[derive(Accounts)]
pub struct TroveBorrow<'info> {
    // TODO: add authority with signature
    #[account(mut)]
    pub trove_data_account: ProgramAccount<'info, TroveData>,

    // Owner of the `from` token account.
    owner: AccountInfo<'info>,

    #[account(mut, has_one = owner)]
    pub from: CpiAccount<'info, TokenAccount>,

    // #[account(mut, "&vault.owner == check_signer.key")]
    vault: CpiAccount<'info, TokenAccount>,

    pub token_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TroveTransfer<'info> {
    #[account(mut)]
    pub trove_data_account: ProgramAccount<'info, TroveData>,

    #[account(mut)]
    pub owner: AccountInfo<'info>,

    #[account(mut)]
    pub to: AccountInfo<'info>,

    pub system_program: AccountInfo<'info>,
}

// #[derive(Accounts)]
// /// Borrow USD from your trove based on your SOL collateral
// pub struct BorrowTroveUSD {}

// /// Paying back your debt to be able to get back your SOL
// #[derive(Accounts)]
// pub struct RepayTroveUSD {}

// /// For any amount of zUSD you can redeem USD worth of SOL
// /// This is a mechanism to keep zUSD pegged to real USD
// #[derive(Accounts)]
// pub struct RedeemSOLTroveUSD {}

// /// Staking USD for the stability pool to earn ZRX and SOL rewards
// /// from fees and liquidations.
// /// Essentially providing liquidity
// #[derive(Accounts)]
// pub struct StakeUSD {}

// /// Staking ZRX to earn rewards from the borrowing and redemption fees
// /// This is like buying shares into the system
// #[derive(Accounts)]
// pub struct StakeZRX {}

// /// If a trove is under Minimum Collateral Ratio, it is liquidatable
// /// by anyone. The liquidator will receive fees + some bonus back
// /// This is an incentive to keep the system collateralized and the
// /// zUSD fully backed by SOL
// #[derive(Accounts)]
// pub struct LiquidateTrove {}

// // Temporary while
// // https://github.com/project-serum/anchor/commit/dd64779273ab441fb40e617e1dd120d5a5559307#diff-43fffbeff5b448207741b2bd0e9a4872347c17dcb5eb7cf655aedd1e519349a2R70
// // is published (or pulled)

// #[derive(Accounts)]
// pub struct SetAuthority<'info> {
//     pub current_authority: AccountInfo<'info>,
//     pub account_or_mint: AccountInfo<'info>,
// }

// mod utils {
//     use super::*;

//     pub fn set_authority<'a, 'b, 'c, 'info>(
//         ctx: CpiContext<'a, 'b, 'c, 'info, SetAuthority<'info>>,
//         authority_type: spl_token::instruction::AuthorityType,
//         new_authority: Option<Pubkey>,
//     ) -> ProgramResult {
//         // How you would call it..
//         // // creating temporary program address
//         // // from current owner to this program
//         // let (pda, _bump_seed) = Pubkey::find_program_address(
//         //     &[b"trove_sol_escrow", &owner.to_account_info().key.to_bytes()],
//         //     ctx.program_id,
//         // );

//         // // cross program invocation (to set ownership)
//         // let cpi_program = ctx.accounts.stablecoin_token_program.clone();
//         // let cpi_accounts = SetAuthority {
//         //     current_authority: owner.clone(),
//         //     account_or_mint: sol_escrow_account.to_account_info().clone(),
//         // };

//         // let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
//         // utils::set_authority(
//         //     cpi_ctx,
//         //     spl_token::instruction::AuthorityType::AccountOwner,
//         //     Some(pda),
//         // )?;

//         let mut spl_new_authority: Option<&Pubkey> = None;
//         if new_authority.is_some() {
//             spl_new_authority = new_authority.as_ref()
//         }

//         let ix = spl_token::instruction::set_authority(
//             &spl_token::ID,
//             ctx.accounts.account_or_mint.key,
//             spl_new_authority,
//             authority_type,
//             ctx.accounts.current_authority.key,
//             &[], // TODO: Support multisig signers.
//         )?;
//         anchor_lang::solana_program::program::invoke_signed(
//             &ix,
//             &[
//                 ctx.accounts.account_or_mint.clone(),
//                 ctx.accounts.current_authority.clone(),
//                 ctx.program.clone(),
//             ],
//             ctx.signer_seeds,
//         )
//     }
// }
