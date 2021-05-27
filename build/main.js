"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.troveDataPubkey = void 0;
// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.
var anchor = __importStar(require("@project-serum/anchor"));
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var fs = __importStar(require("fs"));
var SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
/// Accounts
var liquidityCurrencyMintPubkey =
  "8PsNqXkQWjxX51dRezzEY8XmzgKbKzG8GXFcQSGEG9xs";
var liquidityCurrencyMint = new web3_js_1.PublicKey(
  liquidityCurrencyMintPubkey
);
var splTokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
/// After initialization
var lendingMarketPubkey = "9GLFTCJV1nevb5QKYsCZvAUtxZoEvVLMRVzrHPoDyJK9";
var lendingMarketSecret = Uint8Array.from([
  198, 88, 4, 216, 87, 98, 235, 163, 167, 71, 56, 180, 32, 209, 7, 42, 149, 21,
  218, 245, 105, 98, 32, 133, 17, 251, 255, 102, 212, 210, 175, 176, 122, 202,
  248, 255, 125, 134, 60, 160, 62, 241, 152, 158, 18, 104, 59, 125, 71, 136, 18,
  96, 12, 152, 80, 146, 54, 66, 196, 186, 70, 175, 152, 64,
]);
// LendingMarketAccount {
//   version: 0,
//   bump_seed: 252,
//   owner: BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y,
//   token_program_id: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA,
//   liquidity_token_mint: 8PsNqXkQWjxX51dRezzEY8XmzgKbKzG8GXFcQSGEG9xs
// }
// const anchor = require('@project-serum/anchor');
var programPublicKey = "UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD";
var programId = new anchor.web3.PublicKey(programPublicKey);
var idl = JSON.parse(fs.readFileSync("./target/idl/basic_0.json", "utf8"));
// Configure the local cluster.
var provider = anchor.Provider.local("https://api.devnet.solana.com/");
anchor.setProvider(provider);
var program = new anchor.Program(idl, programId);
// Instructions
// Only call this once
function initializeMarket() {
  return __awaiter(this, void 0, void 0, function () {
    var lendingMarketAccount,
      owner,
      liquidityCurrencyMint,
      splTokenProgramAccount,
      space,
      _a,
      _b,
      _c,
      _d,
      _e;
    var _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          lendingMarketAccount = anchor.web3.Keypair.generate();
          owner = provider.wallet.publicKey;
          liquidityCurrencyMint = new anchor.web3.PublicKey(
            liquidityCurrencyMintPubkey
          );
          splTokenProgramAccount = new anchor.web3.PublicKey(splTokenProgramId);
          console.log("Payer Pubkey " + provider.wallet.publicKey);
          console.log(
            "Lending Market Account Pub " +
              lendingMarketAccount.publicKey +
              " Secret " +
              lendingMarketAccount.secretKey
          );
          space = 1 + 1 + 32 + 32 + 32;
          _b = (_a = program.rpc).initializeMarket;
          _c = [owner];
          _f = {
            accounts: {
              lendingMarketAccount: lendingMarketAccount.publicKey,
              liquidityCurrencyMint: liquidityCurrencyMint,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              tokenProgram: splTokenProgramAccount,
            },
            signers: [lendingMarketAccount],
          };
          _e = (_d = anchor.web3.SystemProgram).createAccount;
          _g = {
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: lendingMarketAccount.publicKey,
            space: 8 + space,
          };
          return [
            4 /*yield*/,
            provider.connection.getMinimumBalanceForRentExemption(8 + space),
          ];
        case 1:
          return [
            4 /*yield*/,
            _b.apply(
              _a,
              _c.concat([
                ((_f.instructions = [
                  _e.apply(_d, [
                    ((_g.lamports = _h.sent()),
                    (_g.programId = program.programId),
                    _g),
                  ]),
                ]),
                _f),
              ])
            ),
          ];
        case 2:
          _h.sent();
          return [2 /*return*/];
      }
    });
  });
}
function initializeTrove() {
  return __awaiter(this, void 0, void 0, function () {
    var owner, associatedTokenAccount, troveDataAccount;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          owner = provider.wallet.publicKey;
          return [
            4 /*yield*/,
            findAssociatedTokenAddress(owner, liquidityCurrencyMint),
          ];
        case 1:
          associatedTokenAccount = _a.sent();
          return [4 /*yield*/, troveDataPubkey(owner)];
        case 2:
          troveDataAccount = _a.sent();
          console.log("Associated Token Account " + associatedTokenAccount);
          console.log("Trove Data Account " + troveDataAccount);
          return [2 /*return*/];
      }
    });
  });
}
function depositTroveSol() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, program.rpc.depositTroveSol()];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
var TROVE_DATA_SEED = "trove_data_0";
function troveDataPubkey(userPubKey) {
  return __awaiter(this, void 0, void 0, function () {
    var account;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            web3_js_1.PublicKey.createWithSeed(
              userPubKey,
              TROVE_DATA_SEED,
              programId
            ),
          ];
        case 1:
          account = _a.sent();
          console.log("Trove Account " + account);
          return [2 /*return*/, account];
      }
    });
  });
}
exports.troveDataPubkey = troveDataPubkey;
function findAssociatedTokenAddress(owner, tokenMintAddress) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            web3_js_1.PublicKey.findProgramAddress(
              [
                owner.toBuffer(),
                spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
                tokenMintAddress.toBuffer(),
              ],
              SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
            ),
          ];
        case 1:
          return [2 /*return*/, _a.sent()[0]];
      }
    });
  });
}
console.log("Running client.");
// initializeMarket().then(() => console.log('Success'));
initializeTrove().then(function () {
  return console.log("Success");
});
// depositTroveSol().then(() => console.log('Success'));
