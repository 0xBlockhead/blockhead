// Types
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'


// Constants
export enum CoinId {
	AAVE = 'AAVE',
	ADA = 'ADA',
	APT = 'APT',
	ARB = 'ARB',
	AVAX = 'AVAX',
	BNB = 'BNB',
	BTC = 'BTC',
	CELO = 'CELO',
	EDU = 'EDU',
	ETH = 'ETH',
	FIL = 'FIL',
	LINK = 'LINK',
	MATIC = 'MATIC',
	MITO = 'MITO',
	OP = 'OP',
	POL = 'POL',
	S = 'S',
	SEI = 'SEI',
	SOL = 'SOL',
	STETH = 'STETH',
	TAC = 'TAC',
	UNI = 'UNI',
	Unknown = 'Unknown',
	USDC = 'USDC',
	USDT = 'USDT',
	WBTC = 'WBTC',
	XDC = 'XDC',
}

export const coins = [
	{
		id: CoinId.AAVE,
		symbol: 'AAVE',
		color: '#2EBAC6',
	},
	{
		id: CoinId.ADA,
		symbol: 'ADA',
		color: '#0033AD',
	},
	{
		id: CoinId.APT,
		symbol: 'APT',
		color: '#00C3F7',
	},
	{
		id: CoinId.ARB,
		symbol: 'ARB',
		color: '#28A0F0',
	},
	{
		id: CoinId.AVAX,
		symbol: 'AVAX',
		color: '#E84142',
	},
	{
		id: CoinId.BNB,
		symbol: 'BNB',
		color: '#F3BA2F',
	},
	{
		id: CoinId.BTC,
		symbol: 'BTC',
		color: '#F7931A',
	},
	{
		id: CoinId.CELO,
		symbol: 'CELO',
		color: '#FCFF52',
	},
	{
		id: CoinId.EDU,
		symbol: 'EDU',
		color: '#7C3AED',
	},
	{
		id: CoinId.ETH,
		symbol: 'ETH',
		color: '#627EEA',
	},
	{
		id: CoinId.FIL,
		symbol: 'FIL',
		color: '#0090FF',
	},
	{
		id: CoinId.LINK,
		symbol: 'LINK',
		color: '#2A5ADA',
	},
	{
		id: CoinId.MATIC,
		symbol: 'MATIC',
		color: '#7B3FE4',
	},
	{
		id: CoinId.MITO,
		symbol: 'MITO',
		color: '#6366F1',
	},
	{
		id: CoinId.OP,
		symbol: 'OP',
		color: '#FF0420',
	},
	{
		id: CoinId.POL,
		symbol: 'POL',
		color: '#7B3FE4',
	},
	{
		id: CoinId.S,
		symbol: 'S',
		color: '#000000',
	},
	{
		id: CoinId.SEI,
		symbol: 'SEI',
		color: '#C1121F',
	},
	{
		id: CoinId.SOL,
		symbol: 'SOL',
		color: '#00FFA3',
	},
	{
		id: CoinId.STETH,
		symbol: 'STETH',
		color: '#00A3FF',
	},
	{
		id: CoinId.TAC,
		symbol: 'TAC',
		color: '#3B82F6',
	},
	{
		id: CoinId.UNI,
		symbol: 'UNI',
		color: '#F50DB4',
	},
	{
		id: CoinId.Unknown,
		symbol: 'Unknown',
		color: '#888888',
	},
	{
		id: CoinId.USDC,
		symbol: 'USDC',
		color: '#2775CA',
	},
	{
		id: CoinId.USDT,
		symbol: 'USDT',
		color: '#26A17B',
	},
	{
		id: CoinId.WBTC,
		symbol: 'WBTC',
		color: '#F09242',
	},
	{
		id: CoinId.XDC,
		symbol: 'XDC',
		color: '#254C81',
	},
] as const satisfies readonly Entity<EntityType.Coin>[]


// Lookups
export const coinById = Object.fromEntries(
	coins
		.map((coin) => [
			coin.id,
			coin
		])
)

export const coinBySymbol = Object.fromEntries(
	coins
		.map((coin) => [
			coin.symbol,
			coin
		])
)
