export const canonicalConfigurationFixtures = [
	{
		networkSlug: 'mainnet',
		marketSlug: 'weth',
		name: 'Compound WETH',
		baseToken: 'WETH',
		baseTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		symbol: 'cWETHv3',
		rates: {
			supplyKink: 0.9, supplySlopeLow: 0.0283824, supplySlopeHigh: 0.6066567706, supplyBase: 0,
			borrowKink: 0.9, borrowSlopeLow: 0.05171500002, borrowSlopeHigh: 0.5171500339, borrowBase: 0.009945209674,
		},
		assets: {
			cbETH: { address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', decimals: '18', borrowCF: 0.90, liquidateCF: 0.93, liquidationFactor: 0.95, supplyCap: '7_100e18' },
			wstETH: { address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', decimals: '18', borrowCF: 0.90, liquidateCF: 0.93, liquidationFactor: 0.95, supplyCap: '64_500e18' },
		},
	},
	{
		networkSlug: 'mainnet',
		marketSlug: 'wsteth',
		name: 'Compound wstETH',
		baseToken: 'wstETH',
		baseTokenAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
		symbol: 'cWstETHv3',
		rates: {
			supplyBase: 0, supplySlopeLow: 0.012, supplyKink: 0.85, supplySlopeHigh: 1,
			borrowBase: 0.01, borrowSlopeLow: 0.014, borrowKink: 0.85, borrowSlopeHigh: 1.15,
		},
		assets: {
			rsETH: { address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7', decimals: '18', borrowCF: 0.88, liquidateCF: 0.91, liquidationFactor: 0.96, supplyCap: '10_000e18' },
			ezETH: { address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110', decimals: '18', borrowCF: 0.88, liquidateCF: 0.91, liquidationFactor: 0.94, supplyCap: '15_000e18' },
		},
	},
] as const

