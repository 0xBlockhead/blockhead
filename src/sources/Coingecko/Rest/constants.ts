import { CoinId } from '$/constants/Coin.ts'

/** Demo vs pro API hosts (REST path {@link pathPrefix}). */
export const demoOrigin = 'https://api.coingecko.com' as const
export const proOrigin = 'https://pro-api.coingecko.com' as const

export const pathPrefix = '/api/v3' as const

export const demoBaseUrl = `${demoOrigin}${pathPrefix}` as const

export const proBaseUrl = `${proOrigin}${pathPrefix}` as const

const catalog: readonly {
	coinId: CoinId
	wireId?: string
	decimals?: number
}[] = [
	{
		coinId: CoinId.BTC,
		wireId: 'bitcoin',
	},
	{
		coinId: CoinId.ETH,
		wireId: 'ethereum',
	},
	{
		coinId: CoinId.USDT,
		wireId: 'tether',
	},
	{
		coinId: CoinId.XRP,
		wireId: 'ripple',
	},
	{
		coinId: CoinId.BNB,
		wireId: 'binancecoin',
	},
	{
		coinId: CoinId.USDC,
		wireId: 'usd-coin',
	},
	{
		coinId: CoinId.SOL,
		wireId: 'solana',
	},
	{
		coinId: CoinId.TRX,
		wireId: 'tron',
	},
	{
		coinId: CoinId.DOGE,
		wireId: 'dogecoin',
	},
	{
		coinId: CoinId.FIGR_HELOC,
		wireId: 'figure-heloc',
	},
	{
		coinId: CoinId.WBT,
		wireId: 'whitebit',
	},
	{
		coinId: CoinId.USDS,
		wireId: 'usds',
	},
	{
		coinId: CoinId.HYPE,
		wireId: 'hyperliquid',
	},
	{
		coinId: CoinId.ADA,
		wireId: 'cardano',
	},
	{
		coinId: CoinId.LEO,
		wireId: 'leo-token',
	},
	{
		coinId: CoinId.BCH,
		wireId: 'bitcoin-cash',
	},
	{
		coinId: CoinId.ZEC,
		wireId: 'zcash',
	},
	{
		coinId: CoinId.XMR,
		wireId: 'monero',
	},
	{
		coinId: CoinId.LINK,
		wireId: 'chainlink',
	},
	{
		coinId: CoinId.TON,
		wireId: 'the-open-network',
	},
	{
		coinId: CoinId.CC,
		wireId: 'canton-network',
	},
	{
		coinId: CoinId.XLM,
		wireId: 'stellar',
	},
	{
		coinId: CoinId.USD1,
		wireId: 'usd1-wlfi',
	},
	{
		coinId: CoinId.M,
		wireId: 'memecore',
	},
	{
		coinId: CoinId.DAI,
		wireId: 'dai',
	},
	{
		coinId: CoinId.LTC,
		wireId: 'litecoin',
	},
	{
		coinId: CoinId.AVAX,
		wireId: 'avalanche-2',
	},
	{
		coinId: CoinId.HBAR,
		wireId: 'hedera-hashgraph',
	},
	{
		coinId: CoinId.SUI,
		wireId: 'sui',
	},
	{
		coinId: CoinId.USDE,
		wireId: 'ethena-usde',
	},
	{
		coinId: CoinId.SHIB,
		wireId: 'shiba-inu',
	},
	{
		coinId: CoinId.RAIN,
		wireId: 'rain',
	},
	{
		coinId: CoinId.PYUSD,
		wireId: 'paypal-usd',
	},
	{
		coinId: CoinId.CRO,
		wireId: 'crypto-com-chain',
	},
	{
		coinId: CoinId.USYC,
		wireId: 'hashnote-usyc',
	},
	{
		coinId: CoinId.TAO,
		wireId: 'bittensor',
	},
	{
		coinId: CoinId.XAUT,
		wireId: 'tether-gold',
	},
	{
		coinId: CoinId.USDG,
		wireId: 'global-dollar',
	},
	{
		coinId: CoinId.BUIDL,
		wireId: 'blackrock-usd-institutional-digital-liquidity-fund',
	},
	{
		coinId: CoinId.PAXG,
		wireId: 'pax-gold',
	},
	{
		coinId: CoinId.DOT,
		wireId: 'polkadot',
	},
	{
		coinId: CoinId.MNT,
		wireId: 'mantle',
	},
	{
		coinId: CoinId.UNI,
		wireId: 'uniswap',
	},
	{
		coinId: CoinId.WLFI,
		wireId: 'world-liberty-financial',
	},
	{
		coinId: CoinId.PI,
		wireId: 'pi-network',
	},
	{
		coinId: CoinId.SKY,
		wireId: 'sky',
	},
	{
		coinId: CoinId.OKB,
		wireId: 'okb',
	},
	{
		coinId: CoinId.USDF,
		wireId: 'falcon-finance',
	},
	{
		coinId: CoinId.PEPE,
		wireId: 'pepe',
	},
	{
		coinId: CoinId.ASTER,
		wireId: 'aster-2',
	},
	{
		coinId: CoinId.HTX,
		wireId: 'htx-dao',
	},
	{
		coinId: CoinId.NEAR,
		wireId: 'near',
	},
	{
		coinId: CoinId.ONDO,
		wireId: 'ondo-finance',
	},
	{
		coinId: CoinId.RLUSD,
		wireId: 'ripple-usd',
	},
	{
		coinId: CoinId.ICP,
		wireId: 'internet-computer',
	},
	{
		coinId: CoinId.USDD,
		wireId: 'usdd',
	},
	{
		coinId: CoinId.ETC,
		wireId: 'ethereum-classic',
	},
	{
		coinId: CoinId.BGB,
		wireId: 'bitget-token',
	},
	{
		coinId: CoinId.AAVE,
		wireId: 'aave',
	},
	{
		coinId: CoinId.MORPHO,
		wireId: 'morpho',
	},
	{
		coinId: CoinId.USDY,
		wireId: 'ondo-us-dollar-yield',
	},
	{
		coinId: CoinId.JTRSY,
		wireId: 'janus-henderson-anemoy-treasury-fund',
	},
	{
		coinId: CoinId.BFUSD,
		wireId: 'bfusd',
	},
	{
		coinId: CoinId.KCS,
		wireId: 'kucoin-shares',
	},
	{
		coinId: CoinId.ALGO,
		wireId: 'algorand',
	},
	{
		coinId: CoinId.POL,
		wireId: 'polygon-ecosystem-token',
	},
	{
		coinId: CoinId.U,
		wireId: 'united-stables',
	},
	{
		coinId: CoinId.USTB,
		wireId: 'superstate-short-duration-us-government-securities-fund-ustb',
	},
	{
		coinId: CoinId.QNT,
		wireId: 'quant-network',
	},
	{
		coinId: CoinId.ENA,
		wireId: 'ethena',
	},
	{
		coinId: CoinId.RENDER,
		wireId: 'render-token',
	},
	{
		coinId: CoinId.EUTBL,
		wireId: 'eutbl',
	},
	{
		coinId: CoinId.ATOM,
		wireId: 'cosmos',
	},
	{
		coinId: CoinId.BCAP,
		wireId: 'blockchain-capital',
	},
	{
		coinId: CoinId.KAS,
		wireId: 'kaspa',
	},
	{
		coinId: CoinId.NEXO,
		wireId: 'nexo',
	},
	{
		coinId: CoinId.FIL,
		wireId: 'filecoin',
	},
	{
		coinId: CoinId.WLD,
		wireId: 'worldcoin-wld',
	},
	{
		coinId: CoinId.GT,
		wireId: 'gatechain-token',
	},
	{
		coinId: CoinId.APT,
		wireId: 'aptos',
	},
	{
		coinId: CoinId.SKYAI,
		wireId: 'skyai',
	},
	{
		coinId: CoinId.STABLE,
		wireId: 'stable-2',
	},
	{
		coinId: CoinId.ARB,
		wireId: 'arbitrum',
	},
	{
		coinId: CoinId.JST,
		wireId: 'just',
	},
	{
		coinId: CoinId.PENGU,
		wireId: 'pudgy-penguins',
	},
	{
		coinId: CoinId.PUMP,
		wireId: 'pump-fun',
	},
	{
		coinId: CoinId.VET,
		wireId: 'vechain',
	},
	{
		coinId: CoinId.FLR,
		wireId: 'flare-networks',
	},
	{
		coinId: CoinId.JUP,
		wireId: 'jupiter-exchange-solana',
	},
	{
		coinId: CoinId.USDTB,
		wireId: 'usdtb',
	},
	{
		coinId: CoinId.BDX,
		wireId: 'beldex',
	},
	{
		coinId: CoinId.LUNC,
		wireId: 'terra-luna',
	},
	{
		coinId: CoinId.DASH,
		wireId: 'dash',
	},
	{
		coinId: CoinId.OUSG,
		wireId: 'ousg',
	},
	{
		coinId: CoinId.HASH,
		wireId: 'hash-2',
	},
	{
		coinId: CoinId.XDC,
		wireId: 'xdce-crowd-sale',
	},
	{
		coinId: CoinId.GHO,
		wireId: 'gho',
	},
	{
		coinId: CoinId.BONK,
		wireId: 'bonk',
	},
	{
		coinId: CoinId.USD0,
		wireId: 'usual-usd',
	},
	{
		coinId: CoinId.TRUMP,
		wireId: 'official-trump',
	},
	{
		coinId: CoinId.SIREN,
		wireId: 'siren-2',
	},
	{
		coinId: CoinId.VIRTUAL,
		wireId: 'virtual-protocol',
	},
	{
		coinId: CoinId.NIGHT,
		wireId: 'midnight-3',
	},
	{
		coinId: CoinId.YLDS,
		wireId: 'ylds',
	},
	{
		coinId: CoinId.DEXE,
		wireId: 'dexe',
	},
	{
		coinId: CoinId.FET,
		wireId: 'fetch-ai',
	},
	{
		coinId: CoinId.CAKE,
		wireId: 'pancakeswap-token',
	},
	{
		coinId: CoinId.TUSD,
		wireId: 'true-usd',
	},
	{
		coinId: CoinId.USDM,
		wireId: 'megausd',
	},
	{
		coinId: CoinId.A7A5,
		wireId: 'a7a5',
	},
	{
		coinId: CoinId.VVV,
		wireId: 'venice-token',
	},
	{
		coinId: CoinId.EDGE,
		wireId: 'edgex',
	},
	{
		coinId: CoinId.STX,
		wireId: 'blockstack',
	},
	{
		coinId: CoinId.B,
		wireId: 'build-on',
	},
	{
		coinId: CoinId.AERO,
		wireId: 'aerodrome-finance',
	},
	{
		coinId: CoinId.CHZ,
		wireId: 'chiliz',
	},
	{
		coinId: CoinId.EURC,
		wireId: 'euro-coin',
	},
	{
		coinId: CoinId.ADI,
		wireId: 'adi-token',
	},
	{
		coinId: CoinId.XTZ,
		wireId: 'tezos',
	},
	{
		coinId: CoinId.SEI,
		wireId: 'sei-network',
	},
	{
		coinId: CoinId.JAAA,
		wireId: 'janus-henderson-anemoy-aaa-clo-fund',
	},
	{
		coinId: CoinId.FDUSD,
		wireId: 'first-digital-usd',
	},
	{
		coinId: CoinId.INJ,
		wireId: 'injective-protocol',
	},
	{
		coinId: CoinId.USX,
		wireId: 'usx',
	},
	{
		coinId: CoinId.____,
		wireId: 'bianrensheng',
	},
	{
		coinId: CoinId.SUN,
		wireId: 'sun-token',
	},
	{
		coinId: CoinId.SPX,
		wireId: 'spx6900',
	},
	{
		coinId: CoinId.CRV,
		wireId: 'curve-dao-token',
	},
	{
		coinId: CoinId.MON,
		wireId: 'monad',
	},
	{
		coinId: CoinId.H,
		wireId: 'humanity',
	},
	{
		coinId: CoinId.ETHFI,
		wireId: 'ether-fi',
	},
	{
		coinId: CoinId.ZRO,
		wireId: 'layerzero',
	},
	{
		coinId: CoinId.GNO,
		wireId: 'gnosis',
	},
	{
		coinId: CoinId.KAU,
		wireId: 'kinesis-gold',
	},
	{
		coinId: CoinId.USDGO,
		wireId: 'usdgo',
	},
	{
		coinId: CoinId.DCR,
		wireId: 'decred',
	},
	{
		coinId: CoinId.TIA,
		wireId: 'celestia',
	},
	{
		coinId: CoinId.UB,
		wireId: 'unibase',
	},
	{
		coinId: CoinId.BSV,
		wireId: 'bitcoin-cash-sv',
	},
	{
		coinId: CoinId.PRIME,
		wireId: 'hastra-prime',
	},
	{
		coinId: CoinId._2Z,
		wireId: 'doublezero',
	},
	{
		coinId: CoinId.CFX,
		wireId: 'conflux-token',
	},
	{
		coinId: CoinId.ZBCN,
		wireId: 'zebec-network',
	},
	{
		coinId: CoinId.FLOKI,
		wireId: 'floki',
	},
	{
		coinId: CoinId.LDO,
		wireId: 'lido-dao',
	},
	{
		coinId: CoinId.BTT,
		wireId: 'bittorrent',
	},
	{
		coinId: CoinId.PENDLE,
		wireId: 'pendle',
	},
	{
		coinId: CoinId.NFT,
		wireId: 'apenft',
	},
	{
		coinId: CoinId.APXUSD,
		wireId: 'apxusd',
	},
	{
		coinId: CoinId.SYRUP,
		wireId: 'syrup',
	},
	{
		coinId: CoinId.CRVUSD,
		wireId: 'crvusd',
	},
	{
		coinId: CoinId.PYTH,
		wireId: 'pyth-network',
	},
	{
		coinId: CoinId.OHM,
		wireId: 'olympus',
	},
	{
		coinId: CoinId.JASMY,
		wireId: 'jasmycoin',
	},
	{
		coinId: CoinId.OP,
		wireId: 'optimism',
	},
	{
		coinId: CoinId.KAG,
		wireId: 'kinesis-silver',
	},
	{
		coinId: CoinId.GRT,
		wireId: 'the-graph',
	},
	{
		coinId: CoinId.APEPE,
		wireId: 'ape-and-pepe',
	},
	{
		coinId: CoinId.KAIA,
		wireId: 'kaia',
	},
	{
		coinId: CoinId.FRAX,
		wireId: 'frax',
	},
	{
		coinId: CoinId.GWEI,
		wireId: 'ethgas-2',
	},
	{
		coinId: CoinId.IOTA,
		wireId: 'iota',
	},
	{
		coinId: CoinId.KITE,
		wireId: 'kite-2',
	},
	{
		coinId: CoinId.REAL,
		wireId: 'reallink',
	},
	{
		coinId: CoinId.EARNETH,
		wireId: 'lido-earn-eth',
	},
	{
		coinId: CoinId.RUSD,
		wireId: 'royal-dollar',
	},
	{
		coinId: CoinId.ENS,
		wireId: 'ethereum-name-service',
	},
	{
		coinId: CoinId.USDAI,
		wireId: 'usdai',
	},
	{
		coinId: CoinId.STRK,
		wireId: 'starknet',
	},
	{
		coinId: CoinId.LIT,
		wireId: 'lighter',
	},
	{
		coinId: CoinId.XPL,
		wireId: 'plasma',
	},
	{
		coinId: CoinId._9BIT,
		wireId: 'the9bit',
	},
	{
		coinId: CoinId.AXS,
		wireId: 'axie-infinity',
	},
	{
		coinId: CoinId.COMP,
		wireId: 'compound-governance-token',
	},
	{
		coinId: CoinId.FARTCOIN,
		wireId: 'fartcoin',
	},
	{
		coinId: CoinId.USDA,
		wireId: 'usda-2',
	},
	{
		coinId: CoinId.RAY,
		wireId: 'raydium',
	},
	{
		coinId: CoinId.WIF,
		wireId: 'dogwifcoin',
	},
	{
		coinId: CoinId.THETA,
		wireId: 'theta-token',
	},
	{
		coinId: CoinId.AUSD,
		wireId: 'agora-dollar',
	},
	{
		coinId: CoinId.LAB,
		wireId: 'lab',
	},
	{
		coinId: CoinId.NEO,
		wireId: 'neo',
	},
	{
		coinId: CoinId.SAND,
		wireId: 'the-sandbox',
	},
	{
		coinId: CoinId.PC0000031,
		wireId: 'tradable-na-rent-financing-platform-sstn',
	},
	{
		coinId: CoinId.GRASS,
		wireId: 'grass',
	},
	{
		coinId: CoinId.XCN,
		wireId: 'chain-2',
	},
	{
		coinId: CoinId.UDS,
		wireId: 'undeads-games',
	},
	{
		coinId: CoinId.TEL,
		wireId: 'telcoin',
	},
	{
		coinId: CoinId.BORG,
		wireId: 'swissborg',
	},
	{
		coinId: CoinId.RUNE,
		wireId: 'thorchain',
	},
	{
		coinId: CoinId.AKT,
		wireId: 'akash-network',
	},
	{
		coinId: CoinId.IP,
		wireId: 'story-2',
	},
	{
		coinId: CoinId.VSN,
		wireId: 'vision-3',
	},
	{
		coinId: CoinId.S,
		wireId: 'sonic-3',
	},
	{
		coinId: CoinId.JTO,
		wireId: 'jito-governance-token',
	},
	{
		coinId: CoinId.WAL,
		wireId: 'walrus-2',
	},
	{
		coinId: CoinId.TWT,
		wireId: 'trust-wallet-token',
	},
	{
		coinId: CoinId.MANA,
		wireId: 'decentraland',
	},
	{
		coinId: CoinId.WFI,
		wireId: 'wefi',
	},
	{
		coinId: CoinId.ASTEROID,
		wireId: 'asteroid-shiba',
	},
	{
		coinId: CoinId.HNT,
		wireId: 'helium',
	},
	{
		coinId: CoinId.GALA,
		wireId: 'gala',
	},
	{
		coinId: CoinId.USTBL,
		wireId: 'spiko-us-t-bills-money-market-fund',
	},
	{
		coinId: CoinId.GENIUS,
		wireId: 'genius-3',
	},
	{
		coinId: CoinId.PIEVERSE,
		wireId: 'pieverse',
	},
	{
		coinId: CoinId.REUSD,
		wireId: 're-protocol-reusd',
	},
	{
		coinId: CoinId.ZK,
		wireId: 'zksync',
	},
	{
		coinId: CoinId.BTSE,
		wireId: 'btse-token',
	},
	{
		coinId: CoinId.RAVE,
		wireId: 'ravedao',
	},
	{
		coinId: CoinId.ONYC,
		wireId: 'onyc',
	},
	{
		coinId: CoinId.CVX,
		wireId: 'convex-finance',
	},
	{
		coinId: CoinId.AR,
		wireId: 'arweave',
	},
	{
		coinId: CoinId.PC0000033,
		wireId: 'tradable-apac-diversified-finance-provider-sstn',
	},
	{
		coinId: CoinId.MX,
		wireId: 'mx-token',
	},
	{
		coinId: CoinId.SFP,
		wireId: 'safepal',
	},
	{
		coinId: CoinId.BAT,
		wireId: 'basic-attention-token',
	},
	{
		coinId: CoinId.CRCLON,
		wireId: 'circle-internet-group-ondo-tokenized-stock',
	},
	{
		coinId: CoinId.APE,
		wireId: 'apecoin',
	},
	{
		coinId: CoinId.SATUSD,
		wireId: 'satoshi-stablecoin',
	},
	{
		coinId: CoinId.TIBBIR,
		wireId: 'ribbita-by-virtuals',
	},
	{
		coinId: CoinId.TRAC,
		wireId: 'origintrail',
	},
	{
		coinId: CoinId.FDIT,
		wireId: 'fidelity-digital-interest-token',
	},
	{
		coinId: CoinId.AB,
		wireId: 'newton-project',
	},
	{
		coinId: CoinId.EURS,
		wireId: 'stasis-eurs',
	},
	{
		coinId: CoinId.ZANO,
		wireId: 'zano',
	},
	{
		coinId: CoinId.GMRT,
		wireId: 'gamer-tag',
	},
	{
		coinId: CoinId.GUSD,
		wireId: 'gusd',
	},
	{
		coinId: CoinId.NUSD,
		wireId: 'nusd-2',
	},
	{
		coinId: CoinId.GLM,
		wireId: 'golem',
	},
	{
		coinId: CoinId.XEC,
		wireId: 'ecash',
	},
	{
		coinId: CoinId.FF,
		wireId: 'falcon-finance-ff',
	},
	{
		coinId: CoinId.IMX,
		wireId: 'immutable-x',
	},
	{
		coinId: CoinId.A,
		wireId: 'vaulta',
	},
	{
		coinId: CoinId.TAG,
		wireId: 'tagger',
	},
	{
		coinId: CoinId.USAT,
		wireId: 'usa',
	},
	{
		coinId: CoinId.EIGEN,
		wireId: 'eigenlayer',
	},
	{
		coinId: CoinId.ULTIMA,
		wireId: 'ultima',
	},
	{
		coinId: CoinId.MEGA,
		wireId: 'megaeth',
	},
	{
		coinId: CoinId.THBILL,
		wireId: 'theo-short-duration-us-treasury-fund',
	},
	{
		coinId: CoinId._1INCH,
		wireId: '1inch',
	},
	{
		coinId: CoinId.FRXUSD,
		wireId: 'frax-usd',
	},
	{
		coinId: CoinId.PC0000097,
		wireId: 'tradable-latam-fintech-sstn',
	},
	{
		coinId: CoinId.ZEN,
		wireId: 'zencash',
	},
	{
		coinId: CoinId.CFG,
		wireId: 'centrifuge-2',
	},
	{
		coinId: CoinId.ACRED,
		wireId: 'apollo-diversified-credit-securitize-fund',
	},
	{
		coinId: CoinId.FLUID,
		wireId: 'instadapp',
	},
	{
		coinId: CoinId.CHEEMS,
		wireId: 'cheems-token',
	},
	{
		coinId: CoinId.EGLD,
		wireId: 'elrond-erd-2',
	},
	{
		coinId: CoinId.BSB,
		wireId: 'block-street',
	},
	{
		coinId: CoinId.RSR,
		wireId: 'reserve-rights-token',
	},
	{
		coinId: CoinId.SHFL,
		wireId: 'shuffle-2',
	},
	{
		coinId: CoinId.OZO,
		wireId: 'ozone-chain',
	},
	{
		coinId: CoinId.DYDX,
		wireId: 'dydx-chain',
	},
	{
		coinId: CoinId.ATH,
		wireId: 'aethir',
	},
	{
		coinId: CoinId.SOSO,
		wireId: 'sosovalue',
	},
	{
		coinId: CoinId.EURCV,
		wireId: 'societe-generale-forge-eurcv',
	},
	{
		coinId: CoinId.CASH,
		wireId: 'cash-4',
	},
	{
		coinId: CoinId.FT,
		wireId: 'flying-tulip',
	},
	{
		coinId: CoinId.GOMINING,
		wireId: 'gmt-token',
	},
	{
		coinId: CoinId.SENT,
		wireId: 'sentient',
	},
	{
		coinId: CoinId.TKX,
		wireId: 'tokenize-xchange',
	},
	{
		coinId: CoinId.KAITO,
		wireId: 'kaito',
	},
	{
		coinId: CoinId._0G,
		wireId: 'zero-gravity',
	},
	{
		coinId: CoinId.BANANAS31,
		wireId: 'banana-for-scale-2',
	},
	{
		coinId: CoinId.CUSD,
		wireId: 'cap-usd',
	},
	{
		coinId: CoinId.PC0000023,
		wireId: 'tradable-singapore-fintech-ssl-2',
	},
	{
		coinId: CoinId.LUX,
		wireId: 'luxxcoin',
	},
	{
		coinId: CoinId.SNX,
		wireId: 'havven',
	},
	{
		coinId: CoinId.RIVER,
		wireId: 'river',
	},
	{
		coinId: CoinId.FORM,
		wireId: 'four',
	},
	{
		coinId: CoinId.WEMIX,
		wireId: 'wemix-token',
	},
	{
		coinId: CoinId.LPT,
		wireId: 'livepeer',
	},
	{
		coinId: CoinId.BILL,
		wireId: 'billions-network',
	},
	{
		coinId: CoinId.CHIP,
		wireId: 'chip-2',
	},
	{
		coinId: CoinId.PC0000015,
		wireId: 'tradable-na-third-party-online-merchant-sstn',
	},
	{
		coinId: CoinId.INI,
		wireId: 'ini',
	},
	{
		coinId: CoinId.AWE,
		wireId: 'stp-network',
	},
	{
		coinId: CoinId.BMX,
		wireId: 'bitmart-token',
	},
	{
		coinId: CoinId.GAS,
		wireId: 'gas',
	},
	{
		coinId: CoinId.RLB,
		wireId: 'rollbit-coin',
	},
	{
		coinId: CoinId.EV,
		wireId: 'everything',
	},
	{
		coinId: CoinId.ORDI,
		wireId: 'ordinals',
	},
	{
		coinId: CoinId.BIO,
		wireId: 'bio-protocol',
	},
	{
		coinId: CoinId.KOGE,
		wireId: 'bnb48-club-token',
	},
	{
		coinId: CoinId.SN64,
		wireId: 'chutes',
	},
	{
		coinId: CoinId.NXM,
		wireId: 'nxm',
	},
	{
		coinId: CoinId.PC0000085,
		wireId: 'tradable-latam-middle-market-lender-sstl',
	},
	{
		coinId: CoinId.SKR,
		wireId: 'seeker',
	},
	{
		coinId: CoinId.SAFE,
		wireId: 'safe',
	},
	{
		coinId: CoinId.BEAM,
		wireId: 'beam-2',
	},
	{
		coinId: CoinId.MELANIA,
		wireId: 'melania-meme',
	},
	{
		coinId: CoinId.STAC,
		wireId: 'securitize-tokenized-aaa-clo-fund',
	},
	{
		coinId: CoinId.PUSD,
		wireId: 'palm-usd',
	},
	{
		coinId: CoinId.MNEE,
		wireId: 'mnee-usd-stablecoin',
	},
	{
		coinId: CoinId.AVUSD,
		wireId: 'avant-usd',
	},
	{
		coinId: CoinId.USDR,
		wireId: 'ring-usd',
	},
	{
		coinId: CoinId.DUSD,
		wireId: 'standx-dusd',
	},
	{
		coinId: CoinId.PC0000077,
		wireId: 'tradable-singapore-fintech-ssl',
	},
	{
		coinId: CoinId.UUSD,
		wireId: 'unity-usd',
	},
	{
		coinId: CoinId.APYUSD,
		wireId: 'apyusd',
	},
	{
		coinId: CoinId.COW,
		wireId: 'cow-protocol',
	},
	{
		coinId: CoinId.BERA,
		wireId: 'berachain-bera',
	},
	{
		coinId: CoinId.RVN,
		wireId: 'ravencoin',
	},
	{
		coinId: CoinId.TRIA,
		wireId: 'tria',
	},
	{
		coinId: CoinId.YFI,
		wireId: 'yearn-finance',
	},
	{
		coinId: CoinId.ENJ,
		wireId: 'enjincoin',
	},
	{
		coinId: CoinId.QTUM,
		wireId: 'qtum',
	},
	{
		coinId: CoinId.ZRX,
		wireId: '0x',
	},
	{
		coinId: CoinId.ORCA,
		wireId: 'orca',
	},
	{
		coinId: CoinId.RAIL,
		wireId: 'railgun',
	},
	{
		coinId: CoinId.SPK,
		wireId: 'spark-2',
	},
	{
		coinId: CoinId.KMNO,
		wireId: 'kamino',
	},
	{
		coinId: CoinId.DRV,
		wireId: 'derive',
	},
	{
		coinId: CoinId.MAG7_SSI,
		wireId: 'mag7-ssi',
	},
	{
		coinId: CoinId.GRX,
		wireId: 'grx-chain',
	},
	{
		coinId: CoinId.LINEA,
		wireId: 'linea',
	},
	{
		coinId: CoinId.MET,
		wireId: 'meteora',
	},
	{
		coinId: CoinId.USDU,
		wireId: 'usdu',
	},
	{
		coinId: CoinId.TURBO,
		wireId: 'turbo',
	},
	{
		coinId: CoinId.KSM,
		wireId: 'kusama',
	},
	{
		coinId: CoinId.TAC,
		wireId: 'tac',
	},
	{
		coinId: CoinId.ICNT,
		wireId: 'impossible-cloud-network-token',
	},
	{
		coinId: CoinId.PGOLD,
		wireId: 'pleasing-gold',
	},
	{
		coinId: CoinId.QRL,
		wireId: 'quantum-resistant-ledger',
	},
	{
		coinId: CoinId.EXOD,
		wireId: 'exod',
	},
	{
		coinId: CoinId.ZIL,
		wireId: 'zilliqa',
	},
	{
		coinId: CoinId.XPR,
		wireId: 'proton',
	},
	{
		coinId: CoinId.AXL,
		wireId: 'axelar',
	},
	{
		coinId: CoinId.BARD,
		wireId: 'lombard-protocol',
	},
	{
		coinId: CoinId.JUSD,
		wireId: 'jusd',
	},
	{
		coinId: CoinId.PROS,
		wireId: 'pharos-network',
	},
	{
		coinId: CoinId.TFUEL,
		wireId: 'theta-fuel',
	},
	{
		coinId: CoinId.ZETA,
		wireId: 'zetachain',
	},
	{
		coinId: CoinId.XDAI,
		wireId: 'xdai',
	},
	{
		coinId: CoinId.QUBIC,
		wireId: 'qubic-network',
	},
	{
		coinId: CoinId.BASEDHYPE,
		wireId: 'basedhype',
	},
	{
		coinId: CoinId.STRCX,
		wireId: 'strategy-pp-variable-xstock',
	},
	{
		coinId: CoinId.AIOZ,
		wireId: 'aioz-network',
	},
	{
		coinId: CoinId.VCNT,
		wireId: 'vicicoin',
	},
	{
		coinId: CoinId.CTC,
		wireId: 'creditcoin-2',
	},
	{
		coinId: CoinId.KTA,
		wireId: 'keeta',
	},
	{
		coinId: CoinId.DUSK,
		wireId: 'dusk-network',
	},
	{
		coinId: CoinId.IUSD,
		wireId: 'infinifi-usd',
	},
	{
		coinId: CoinId.NAORIS,
		wireId: 'naoris',
	},
	{
		coinId: CoinId.LB,
		wireId: 'lovebit',
	},
	{
		coinId: CoinId.METAL,
		wireId: 'metal-blockchain',
	},
	{
		coinId: CoinId.ARKM,
		wireId: 'arkham',
	},
	{
		coinId: CoinId.CYS,
		wireId: 'cysic',
	},
	{
		coinId: CoinId.MINA,
		wireId: 'mina-protocol',
	},
	{
		coinId: CoinId.W,
		wireId: 'wormhole',
	},
	{
		coinId: CoinId.SAHARA,
		wireId: 'sahara-ai',
	},
	{
		coinId: CoinId.NXPC,
		wireId: 'nexpace',
	},
	{
		coinId: CoinId.BABYDOGE,
		wireId: 'baby-doge-coin',
	},
	{
		coinId: CoinId.SUPER,
		wireId: 'superfarm',
	},
	{
		coinId: CoinId.BRETT,
		wireId: 'based-brett',
	},
	{
		coinId: CoinId.DOG,
		wireId: 'dog-go-to-the-moon-rune',
	},
	{
		coinId: CoinId.WOULD,
		wireId: 'would',
	},
	{
		coinId: CoinId.BC,
		wireId: 'bc-token',
	},
	{
		coinId: CoinId.DEEP,
		wireId: 'deep',
	},
	{
		coinId: CoinId.BCE,
		wireId: 'bitcastle-token',
	},
	{
		coinId: CoinId.ROSE,
		wireId: 'oasis-network',
	},
	{
		coinId: CoinId.STAU,
		wireId: 'stau',
	},
	{
		coinId: CoinId.MBG,
		wireId: 'mbg-by-multibank-group',
	},
	{
		coinId: CoinId.RON,
		wireId: 'ronin',
	},
	{
		coinId: CoinId.BAN,
		wireId: 'comedian',
	},
	{
		coinId: CoinId.HOT,
		wireId: 'holotoken',
	},
	{
		coinId: CoinId.BLUR,
		wireId: 'blur',
	},
	{
		coinId: CoinId.TOSHI,
		wireId: 'toshi',
	},
	{
		coinId: CoinId.ASTR,
		wireId: 'astar',
	},
	{
		coinId: CoinId.UMXM,
		wireId: 'manadia',
	},
	{
		coinId: CoinId.GTUSDA,
		wireId: 'gauntlet-usd-alpha',
	},
	{
		coinId: CoinId.AMP,
		wireId: 'amp-token',
	},
	{
		coinId: CoinId.PMUSD,
		wireId: 'precious-metals-usd',
	},
	{
		coinId: CoinId.UAI,
		wireId: 'unifai-network',
	},
	{
		coinId: CoinId.PC0000101,
		wireId: 'na-post-settlement-legal-financing-receivables',
	},
	{
		coinId: CoinId.GMX,
		wireId: 'gmx',
	},
	{
		coinId: CoinId.CKB,
		wireId: 'nervos-network',
	},
	{
		coinId: CoinId.LISUSD,
		wireId: 'helio-protocol-hay',
	},
	{
		coinId: CoinId.MWC,
		wireId: 'mimblewimblecoin',
	},
	{
		coinId: CoinId.SN4,
		wireId: 'targon',
	},
	{
		coinId: CoinId.BEAT,
		wireId: 'audiera',
	},
	{
		coinId: CoinId.FOGO,
		wireId: 'fogo',
	},
	{
		coinId: CoinId.CGUSD,
		wireId: 'cygnus-finance-global-usd',
	},
	{
		coinId: CoinId.FEUSD,
		wireId: 'felix-feusd',
	},
	{
		coinId: CoinId.DBR,
		wireId: 'debridge',
	},
	{
		coinId: CoinId.APES,
		wireId: 'apes-2-2',
	},
	{
		coinId: CoinId.XAUM,
		wireId: 'matrixdock-gold',
	},
	{
		coinId: CoinId.VBILL,
		wireId: 'vaneck-treasury-fund',
	},
	{
		coinId: CoinId.DGB,
		wireId: 'digibyte',
	},
	{
		coinId: CoinId.CET,
		wireId: 'coinex-token',
	},
	{
		coinId: CoinId.MF_ONE,
		wireId: 'midas-mf-one',
	},
	{
		coinId: CoinId.TEMPLE,
		wireId: 'temple',
	},
	{
		coinId: CoinId.ARC,
		wireId: 'ai-rig-complex',
	},
	{
		coinId: CoinId.KAVA,
		wireId: 'kava',
	},
	{
		coinId: CoinId.T,
		wireId: 'threshold-network-token',
	},
	{
		coinId: CoinId.ONT,
		wireId: 'ontology',
	},
	{
		coinId: CoinId.BABY,
		wireId: 'babylon',
	},
	{
		coinId: CoinId.IRYS,
		wireId: 'irys',
	},
	{
		coinId: CoinId.PLUME,
		wireId: 'plume',
	},
	{
		coinId: CoinId.MSUSD,
		wireId: 'main-street-usd',
	},
	{
		coinId: CoinId.HUNT,
		wireId: 'greyhunt',
	},
	{
		coinId: CoinId.FLOW,
		wireId: 'flow',
	},
	{
		coinId: CoinId.MOVE,
		wireId: 'movement',
	},
	{
		coinId: CoinId.COAI,
		wireId: 'chainopera-ai',
	},
	{
		coinId: CoinId.NILA,
		wireId: 'mindwavedao',
	},
	{
		coinId: CoinId.ALCH,
		wireId: 'alchemist-ai',
	},
	{
		coinId: CoinId.ELF,
		wireId: 'aelf',
	},
	{
		coinId: CoinId.NPC,
		wireId: 'non-playable-coin',
	},
	{
		coinId: CoinId.META,
		wireId: 'meta-2-2',
	},
	{
		coinId: CoinId.POLYX,
		wireId: 'polymesh',
	},
	{
		coinId: CoinId.ZAMA,
		wireId: 'zama',
	},
	{
		coinId: CoinId.PUFF,
		wireId: 'puff-the-dragon',
	},
	{
		coinId: CoinId.SN51,
		wireId: 'celium',
	},
	{
		coinId: CoinId.DOLA,
		wireId: 'dola-usd',
	},
	{
		coinId: CoinId.USDAT,
		wireId: 'saturn-dollar',
	},
	{
		coinId: CoinId.XVG,
		wireId: 'verge',
	},
	{
		coinId: CoinId.TBK,
		wireId: 'tronbank',
	},
	{
		coinId: CoinId.XUSD,
		wireId: 'straitsx-xusd',
	},
	{
		coinId: CoinId.SUSHI,
		wireId: 'sushi',
	},
	{
		coinId: CoinId.NMR,
		wireId: 'numeraire',
	},
	{
		coinId: CoinId.MOODENG,
		wireId: 'moo-deng',
	},
	{
		coinId: CoinId.JUPUSD,
		wireId: 'jupusd',
	},
	{
		coinId: CoinId.PC0000019,
		wireId: 'tradable-north-america-pos-lender-sstn',
	},
	{
		coinId: CoinId.VELO,
		wireId: 'velo',
	},
	{
		coinId: CoinId.POPCAT,
		wireId: 'popcat',
	},
	{
		coinId: CoinId.REKT,
		wireId: 'rekt-4',
	},
	{
		coinId: CoinId.AZTEC,
		wireId: 'aztec',
	},
	{
		coinId: CoinId.VRSC,
		wireId: 'verus-coin',
	},
	{
		coinId: CoinId.AGENTFUN,
		wireId: 'agentfun-ai',
	},
	{
		coinId: CoinId.QFI,
		wireId: 'quantixai',
	},
	{
		coinId: CoinId.PNUT,
		wireId: 'peanut-the-squirrel',
	},
	{
		coinId: CoinId.SWOP,
		wireId: 'swop-2',
	},
	{
		coinId: CoinId.NOCK,
		wireId: 'nockchain',
	},
	{
		coinId: CoinId.KUB,
		wireId: 'bitkub-coin',
	},
	{
		coinId: CoinId.XNO,
		wireId: 'nano',
	},
	{
		coinId: CoinId.ZORA,
		wireId: 'zora',
	},
	{
		coinId: CoinId.MOG,
		wireId: 'mog-coin',
	},
	{
		coinId: CoinId.UPUMP,
		wireId: 'unit-pump',
	},
	{
		coinId: CoinId.ESPORTS,
		wireId: 'yooldo-games',
	},
	{
		coinId: CoinId.USDX,
		wireId: 'usdx',
	},
	{
		coinId: CoinId.EURI,
		wireId: 'eurite',
	},
	{
		coinId: CoinId.VTHO,
		wireId: 'vethor-token',
	},
	{
		coinId: CoinId.NOT,
		wireId: 'notcoin',
	},
	{
		coinId: CoinId.SN120,
		wireId: 'affine',
	},
	{
		coinId: CoinId.BDCA,
		wireId: 'bitdca',
	},
	{
		coinId: CoinId.DUAL,
		wireId: 'dual',
	},
	{
		coinId: CoinId.MSY,
		wireId: 'main-street-yield',
	},
	{
		coinId: CoinId.SOON,
		wireId: 'soon-2',
	},
	{
		coinId: CoinId.CELO,
		wireId: 'celo',
	},
	{
		coinId: CoinId.CCD,
		wireId: 'concordium',
	},
	{
		coinId: CoinId.MEW,
		wireId: 'cat-in-a-dogs-world',
	},
	{
		coinId: CoinId.TRB,
		wireId: 'tellor',
	},
	{
		coinId: CoinId.WMTX,
		wireId: 'world-mobile-token',
	},
	{
		coinId: CoinId.ME,
		wireId: 'magic-eden',
	},
	{
		coinId: CoinId.VVS,
		wireId: 'vvs-finance',
	},
	{
		coinId: CoinId.MOCA,
		wireId: 'mocaverse',
	},
	{
		coinId: CoinId.HSK,
		wireId: 'hashkey-ecopoints',
	},
	{
		coinId: CoinId.API3,
		wireId: 'api3',
	},
	{
		coinId: CoinId.BRLV,
		wireId: 'crown-brlv',
	},
	{
		coinId: CoinId.TSLAX,
		wireId: 'tesla-xstock',
	},
	{
		coinId: CoinId.GEOD,
		wireId: 'geodnet',
	},
	{
		coinId: CoinId.LION,
		wireId: 'loaded-lions',
	},
	{
		coinId: CoinId.CRCLX,
		wireId: 'circle-xstock',
	},
	{
		coinId: CoinId.PCI,
		wireId: 'pay-coin',
	},
	{
		coinId: CoinId.BRZ,
		wireId: 'brz',
	},
	{
		coinId: CoinId.RIF,
		wireId: 'rif-token',
	},
	{
		coinId: CoinId.RED,
		wireId: 'redstone-oracles',
	},
	{
		coinId: CoinId.JELLYJELLY,
		wireId: 'jelly-my-jelly',
	},
	{
		coinId: CoinId.TDCCP,
		wireId: 'tdccp',
	},
	{
		coinId: CoinId.PC0000081,
		wireId: 'tradable-na-legal-receivables-ssl',
	},
	{
		coinId: CoinId.NAT,
		wireId: 'dmt-nat',
	},
	{
		coinId: CoinId.USDON,
		wireId: 'ondo-u-s-dollar-token',
	},
	{
		coinId: CoinId.REQ,
		wireId: 'request-network',
	},
	{
		coinId: CoinId.MTBILL,
		wireId: 'midas-mtbill',
	},
	{
		coinId: CoinId.PYTHIA,
		wireId: 'pythia',
	},
	{
		coinId: CoinId.ELG,
		wireId: 'escoin-token',
	},
	{
		coinId: CoinId.LUNA,
		wireId: 'terra-luna-2',
	},
	{
		coinId: CoinId.SN44,
		wireId: 'score',
	},
	{
		coinId: CoinId.ANKR,
		wireId: 'ankr',
	},
	{
		coinId: CoinId.SC,
		wireId: 'siacoin',
	},
	{
		coinId: CoinId.FIDD,
		wireId: 'fidelity-digital-dollar',
	},
	{
		coinId: CoinId.MANTRA,
		wireId: 'mantra',
	},
	{
		coinId: CoinId.HOME,
		wireId: 'home',
	},
	{
		coinId: CoinId.SIERRA,
		wireId: 'sierra-2',
	},
	{
		coinId: CoinId.PROVE,
		wireId: 'succinct',
	},
	{
		coinId: CoinId.MASK,
		wireId: 'mask-network',
	},
	{
		coinId: CoinId.DIEM,
		wireId: 'diem',
	},
	{
		coinId: CoinId.USDKG,
		wireId: 'usdkg',
	},
	{
		coinId: CoinId.AUSDT,
		wireId: 'alloy-tether',
	},
	{
		coinId: CoinId.XYO,
		wireId: 'xyo-network',
	},
	{
		coinId: CoinId.OPG,
		wireId: 'opengradient',
	},
	{
		coinId: CoinId.CWU,
		wireId: 'commonwealth-2',
	},
	{
		coinId: CoinId.LBT,
		wireId: 'law-blocks',
	},
	{
		coinId: CoinId.ALT,
		wireId: 'altlayer',
	},
	{
		coinId: CoinId.PC0000049,
		wireId: 'tradable-eu-latam-pos-financing-sstl',
	},
	{
		coinId: CoinId.MERL,
		wireId: 'merlin-chain',
	},
	{
		coinId: CoinId.RIV,
		wireId: 'riv-coin',
	},
	{
		coinId: CoinId.VANA,
		wireId: 'vana',
	},
	{
		coinId: CoinId.AVNT,
		wireId: 'avantis',
	},
	{
		coinId: CoinId.PRL,
		wireId: 'perle',
	},
	{
		coinId: CoinId.STETH,
		wireId: 'staked-ether',
	},
	{
		coinId: CoinId.WBTC,
		wireId: 'wrapped-bitcoin',
	},
	{
		coinId: CoinId.MITO,
		wireId: 'mitosis',
	},
] as const

/** CoinGecko coin id strings (`/coins/{id}` path segment). */
export const idByCoinId: Partial<Record<CoinId, string>> = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.wireId == null ?
				[]
			:	[[entry.coinId, entry.wireId] as const]
		)),
)

export const coinIdByWireId: Partial<Record<string, CoinId>> = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.wireId == null ?
				[]
			:	[[entry.wireId, entry.coinId] as const]
		)),
)

export const decimalsByCoinId: Partial<Record<CoinId, number>> = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.decimals == null ?
				[]
			:	[[entry.coinId, entry.decimals] as const]
		)),
)

export const coingeckoCatalogCoinIds: readonly CoinId[] = catalog.flatMap((entry) => (
	entry.wireId == null ?
		[]
:	[entry.coinId]
))


/** CoinGecko derivatives exchange id per catalog venue (`binance` spot vs `binance_futures`). */
export const coingeckoDerivativesExchangeIdByMarketVenueId = {
	Binance: 'binance_futures',
	Coinbase: 'coinbase_international_derivatives',
	Deribit: 'deribit',
	Kraken: 'kraken_futures',
	Kucoin: 'kucoin_futures',
	Okx: 'okex_swap',
} as const
