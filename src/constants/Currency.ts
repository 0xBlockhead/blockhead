// Types

export enum Iso4217 {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	JPY = 'JPY',
	CHF = 'CHF',
	CAD = 'CAD',
	AUD = 'AUD',
	CNY = 'CNY',
	HKD = 'HKD',
	SGD = 'SGD',
	KRW = 'KRW',
	INR = 'INR',
	BRL = 'BRL',
	MXN = 'MXN',
	TRY = 'TRY',
	PLN = 'PLN',
	AED = 'AED',
	SAR = 'SAR',
	NZD = 'NZD',
	ZAR = 'ZAR',
	SEK = 'SEK',
	NOK = 'NOK',
	DKK = 'DKK',
	TWD = 'TWD',
	THB = 'THB',
	IDR = 'IDR',
	PHP = 'PHP',
	MYR = 'MYR',
	CZK = 'CZK',
	HUF = 'HUF',
	ILS = 'ILS',
	CLP = 'CLP',
	ARS = 'ARS',
}


// Constants

// 2025-01-01T00:00:00Z — catalog snapshot for Currency_Timestamp ids
export const currencyCatalogSnapshotTimestampMs = 1_735_689_600_000


export const currencies = [
	{
		iso4217: Iso4217.USD,
		name: 'United States dollar',
		symbol: '$',
		minorUnitExponent: 2,
		marketCapUsd: 6_500_000_000_000,
	},
	{
		iso4217: Iso4217.EUR,
		name: 'Euro',
		symbol: '€',
		minorUnitExponent: 2,
		marketCapUsd: 2_200_000_000_000,
	},
	{
		iso4217: Iso4217.GBP,
		name: 'Pound sterling',
		symbol: '£',
		minorUnitExponent: 2,
		marketCapUsd: 900_000_000_000,
	},
	{
		iso4217: Iso4217.JPY,
		name: 'Japanese yen',
		symbol: '¥',
		minorUnitExponent: 0,
		marketCapUsd: 1_500_000_000_000,
	},
	{
		iso4217: Iso4217.CHF,
		name: 'Swiss franc',
		symbol: 'Fr',
		minorUnitExponent: 2,
		marketCapUsd: 360_000_000_000,
	},
	{
		iso4217: Iso4217.CAD,
		name: 'Canadian dollar',
		symbol: 'CA$',
		minorUnitExponent: 2,
		marketCapUsd: 380_000_000_000,
	},
	{
		iso4217: Iso4217.AUD,
		name: 'Australian dollar',
		symbol: 'A$',
		minorUnitExponent: 2,
		marketCapUsd: 450_000_000_000,
	},
	{
		iso4217: Iso4217.CNY,
		name: 'Chinese yuan',
		symbol: '¥',
		minorUnitExponent: 2,
		marketCapUsd: 600_000_000_000,
	},
	{
		iso4217: Iso4217.HKD,
		name: 'Hong Kong dollar',
		symbol: 'HK$',
		minorUnitExponent: 2,
		marketCapUsd: 300_000_000_000,
	},
	{
		iso4217: Iso4217.SGD,
		name: 'Singapore dollar',
		symbol: 'S$',
		minorUnitExponent: 2,
		marketCapUsd: 180_000_000_000,
	},
	{
		iso4217: Iso4217.KRW,
		name: 'South Korean won',
		symbol: '₩',
		minorUnitExponent: 0,
		marketCapUsd: 500_000_000_000,
	},
	{
		iso4217: Iso4217.INR,
		name: 'Indian rupee',
		symbol: '₹',
		minorUnitExponent: 2,
		marketCapUsd: 400_000_000_000,
	},
	{
		iso4217: Iso4217.BRL,
		name: 'Brazilian real',
		symbol: 'R$',
		minorUnitExponent: 2,
		marketCapUsd: 200_000_000_000,
	},
	{
		iso4217: Iso4217.MXN,
		name: 'Mexican peso',
		symbol: 'MX$',
		minorUnitExponent: 2,
		marketCapUsd: 100_000_000_000,
	},
	{
		iso4217: Iso4217.TRY,
		name: 'Turkish lira',
		symbol: '₺',
		minorUnitExponent: 2,
		marketCapUsd: 200_000_000_000,
	},
	{
		iso4217: Iso4217.PLN,
		name: 'Polish złoty',
		symbol: 'zł',
		minorUnitExponent: 2,
		marketCapUsd: 90_000_000_000,
	},
	{
		iso4217: Iso4217.AED,
		name: 'United Arab Emirates dirham',
		symbol: 'د.إ',
		minorUnitExponent: 2,
		marketCapUsd: 120_000_000_000,
	},
	{
		iso4217: Iso4217.SAR,
		name: 'Saudi riyal',
		symbol: '﷼',
		minorUnitExponent: 2,
		marketCapUsd: 100_000_000_000,
	},
	{
		iso4217: Iso4217.NZD,
		name: 'New Zealand dollar',
		symbol: 'NZ$',
		minorUnitExponent: 2,
		marketCapUsd: 110_000_000_000,
	},
	{
		iso4217: Iso4217.ZAR,
		name: 'South African rand',
		symbol: 'R',
		minorUnitExponent: 2,
		marketCapUsd: 80_000_000_000,
	},
	{
		iso4217: Iso4217.SEK,
		name: 'Swedish krona',
		symbol: 'kr',
		minorUnitExponent: 2,
		marketCapUsd: 150_000_000_000,
	},
	{
		iso4217: Iso4217.NOK,
		name: 'Norwegian krone',
		symbol: 'kr',
		minorUnitExponent: 2,
		marketCapUsd: 120_000_000_000,
	},
	{
		iso4217: Iso4217.DKK,
		name: 'Danish krone',
		symbol: 'kr',
		minorUnitExponent: 2,
		marketCapUsd: 80_000_000_000,
	},
	{
		iso4217: Iso4217.TWD,
		name: 'New Taiwan dollar',
		symbol: 'NT$',
		minorUnitExponent: 2,
		marketCapUsd: 90_000_000_000,
	},
	{
		iso4217: Iso4217.THB,
		name: 'Thai baht',
		symbol: '฿',
		minorUnitExponent: 2,
		marketCapUsd: 70_000_000_000,
	},
	{
		iso4217: Iso4217.IDR,
		name: 'Indonesian rupiah',
		symbol: 'Rp',
		minorUnitExponent: 2,
		marketCapUsd: 50_000_000_000,
	},
	{
		iso4217: Iso4217.PHP,
		name: 'Philippine peso',
		symbol: '₱',
		minorUnitExponent: 2,
		marketCapUsd: 60_000_000_000,
	},
	{
		iso4217: Iso4217.MYR,
		name: 'Malaysian ringgit',
		symbol: 'RM',
		minorUnitExponent: 2,
		marketCapUsd: 55_000_000_000,
	},
	{
		iso4217: Iso4217.CZK,
		name: 'Czech koruna',
		symbol: 'Kč',
		minorUnitExponent: 2,
		marketCapUsd: 40_000_000_000,
	},
	{
		iso4217: Iso4217.HUF,
		name: 'Hungarian forint',
		symbol: 'Ft',
		minorUnitExponent: 2,
		marketCapUsd: 30_000_000_000,
	},
	{
		iso4217: Iso4217.ILS,
		name: 'Israeli new shekel',
		symbol: '₪',
		minorUnitExponent: 2,
		marketCapUsd: 50_000_000_000,
	},
	{
		iso4217: Iso4217.CLP,
		name: 'Chilean peso',
		symbol: 'CL$',
		minorUnitExponent: 0,
		marketCapUsd: 35_000_000_000,
	},
	{
		iso4217: Iso4217.ARS,
		name: 'Argentine peso',
		symbol: 'AR$',
		minorUnitExponent: 2,
		marketCapUsd: 40_000_000_000,
	},
] as const satisfies readonly {
	iso4217: Iso4217
	name: string
	symbol: string
	minorUnitExponent: number
	/** BIS-style daily FX turnover weight in USD (catalog ordering; not token market cap). */
	marketCapUsd: number
}[]


// Lookups

export const currencyByIso4217 = Object.fromEntries(
	currencies.map((currency) => [
		currency.iso4217,
		currency,
	])
)


/** Fiat majors with a catalog {@link Market} row as base vs USD quote (FX cross). */
export const iso4217WithCatalogUsdCrossAsBase = [
	Iso4217.EUR,
	Iso4217.GBP,
	Iso4217.JPY,
	Iso4217.CHF,
	Iso4217.AUD,
	Iso4217.CAD,
	Iso4217.CNY,
	Iso4217.HKD,
	Iso4217.SGD,
	Iso4217.NZD,
	Iso4217.SEK,
	Iso4217.NOK,
	Iso4217.DKK,
	Iso4217.MXN,
	Iso4217.BRL,
	Iso4217.INR,
	Iso4217.KRW,
	Iso4217.TWD,
	Iso4217.ZAR,
	Iso4217.PLN,
	Iso4217.TRY,
] as const satisfies readonly Iso4217[]
