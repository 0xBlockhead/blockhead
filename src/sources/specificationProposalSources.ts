// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'

const cases = [
	[
		'Bitcoin',
		[
			'Bip',
		],
		Source.BitcoinBips_Github,
	],
	[
		'BitcoinCash',
		[
			'Chip',
		],
		Source.BitcoinCashChips_Gitlab,
	],
	[
		'ChainAgnostic',
		[
			'Caip',
		],
		Source.Caips_Github,
	],
	[
		'Cosmos',
		[
			'Adr',
		],
		Source.CosmosAdrs_Github,
	],
	[
		'Dogecoin',
		[
			'Dip',
		],
		Source.DogecoinDips_Github,
	],
	[
		'Ens',
		[
			'Ensip',
		],
		Source.Ensips_Github,
	],
	[
		'Ethereum',
		[
			'Eip',
			'Erc',
		],
		Source.EthereumEips_Github,
	],
	[
		'Filecoin',
		[
			'Fip',
		],
		Source.FilecoinFips_Github,
	],
	[
		'Hyperliquid',
		[
			'Hip',
		],
		Source.HyperliquidDocs_Rest,
	],
	[
		'Litecoin',
		[
			'Lip',
		],
		Source.LitecoinLips_Github,
	],
	[
		'Near',
		[
			'Nep',
		],
		Source.NearNeps_Github,
	],
	[
		'Polkadot',
		[
			'Rfc',
		],
		Source.PolkadotRfcs_Github,
	],
	[
		'Quilibrium',
		[
			'ProtocolDocument',
		],
		Source.QuilibriumDocs_Rest,
	],
	[
		'Solana',
		[
			'Simd',
		],
		Source.SolanaSimds_Github,
	],
	[
		'Zcash',
		[
			'Zip',
		],
		Source.ZcashZips_Github,
	],
] as const
type Case = typeof cases[number]

const defaultSources = cases.map(([, , source]) => source)

export default ({
	realm,
	category,
}: {
	realm?: Case[0]
	category?: Case[1][number]
}) => {
	const matchedSource = cases.find(([firstFieldValue, secondFieldValues]) => (
		firstFieldValue === realm
		&& secondFieldValues.some((secondFieldValue) => secondFieldValue === category)
	))?.[2]

	return matchedSource == null ? [...defaultSources] : [matchedSource]
}
