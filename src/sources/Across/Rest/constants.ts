/**
 * Across deposit lifecycle + spoke-pool chain catalog.
 * Status names from https://docs.across.to/introduction/tracking-deposits
 * Chains/spoke pools from https://app.across.to/api/chains
 */


// Types

type AcrossDepositStatusRow = {
	status: (
		| 'pending'
		| 'received'
		| 'filled'
		| 'expired'
		| 'refunded'
	)
	label: string
	terminal: boolean
}

type AcrossChainRow = {
	chainId: number
	name: string
	spokePool: string
	isEvm: boolean
}


// Constants

const acrossDepositStatuses = [
	{
		status: 'pending',
		label: 'Deposit submitted; not yet filled',
		terminal: false,
	},
	{
		status: 'received',
		label: 'Deposit indexed; awaiting fill',
		terminal: false,
	},
	{
		status: 'filled',
		label: 'Filled on destination; recipient received funds',
		terminal: true,
	},
	{
		status: 'expired',
		label: 'Fill deadline passed; refund pending on origin',
		terminal: true,
	},
	{
		status: 'refunded',
		label: 'Depositor refunded on origin',
		terminal: true,
	},
] as const satisfies readonly AcrossDepositStatusRow[]

const acrossChains = [
	{
		chainId: 1,
		name: 'Ethereum',
		spokePool: '0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5',
		isEvm: true,
	},
	{
		chainId: 10,
		name: 'Optimism',
		spokePool: '0x6f26bf09b1c792e3228e5467807a900a503c0281',
		isEvm: true,
	},
	{
		chainId: 56,
		name: 'BNB Smart Chain',
		spokePool: '0x4e8e101924ede233c13e2d8622dc8aed2872d505',
		isEvm: true,
	},
	{
		chainId: 130,
		name: 'Unichain',
		spokePool: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
		isEvm: true,
	},
	{
		chainId: 137,
		name: 'Polygon',
		spokePool: '0x9295ee1d8c5b022be115a2ad3c30c72e34e7f096',
		isEvm: true,
	},
	{
		chainId: 143,
		name: 'Monad',
		spokePool: '0xd2ecb3afe598b746f8123cae365a598da831a449',
		isEvm: true,
	},
	{
		chainId: 232,
		name: 'Lens',
		spokePool: '0xb234ca484866c811d0e6d3318866f583781ed045',
		isEvm: true,
	},
	{
		chainId: 324,
		name: 'zkSync',
		spokePool: '0xe0b015e54d54fc84a6cb9b666099c46ade9335ff',
		isEvm: true,
	},
	{
		chainId: 480,
		name: 'World Chain',
		spokePool: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
		isEvm: true,
	},
	{
		chainId: 999,
		name: 'HyperEVM',
		spokePool: '0x35e63ea3eb0fb7a3bc543c71fb66412e1f6b0e04',
		isEvm: true,
	},
	{
		chainId: 1135,
		name: 'Lisk',
		spokePool: '0x9552a0a6624a23b848060ae5901659cdda1f83f8',
		isEvm: true,
	},
	{
		chainId: 1868,
		name: 'Soneium',
		spokePool: '0x3bad7ad0728f9917d1bf08af5782dcbd516cdd96',
		isEvm: true,
	},
	{
		chainId: 4217,
		name: 'Tempo',
		spokePool: '0x2d4710f04da90184255782d3715224a6c776955d',
		isEvm: true,
	},
	{
		chainId: 4326,
		name: 'MegaETH',
		spokePool: '0x3db06da8f0a24a525f314eec954fc5c6a973d40e',
		isEvm: true,
	},
	{
		chainId: 4663,
		name: 'Robinhood',
		spokePool: '0xd29c85f15df544ba632c9e25829fd29d767d7978',
		isEvm: true,
	},
	{
		chainId: 8453,
		name: 'Base',
		spokePool: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64',
		isEvm: true,
	},
	{
		chainId: 9745,
		name: 'Plasma',
		spokePool: '0x50039faefebef707cfd94d6d462fe6d10b39207a',
		isEvm: true,
	},
	{
		chainId: 34443,
		name: 'Mode',
		spokePool: '0x3bad7ad0728f9917d1bf08af5782dcbd516cdd96',
		isEvm: true,
	},
	{
		chainId: 42161,
		name: 'Arbitrum',
		spokePool: '0xe35e9842fceaca96570b734083f4a58e8f7c5f2a',
		isEvm: true,
	},
	{
		chainId: 43114,
		name: 'Avalanche',
		spokePool: '0xfe9d541c92e4e90437c7152a00244886de37a658',
		isEvm: true,
	},
	{
		chainId: 57073,
		name: 'Ink',
		spokePool: '0xef684c38f94f48775959ecf2012d7e864ffb9dd4',
		isEvm: true,
	},
	{
		chainId: 59144,
		name: 'Linea',
		spokePool: '0x7e63a5f1a8f0b4d0934b2f2327daed3f6bb2ee75',
		isEvm: true,
	},
	{
		chainId: 7777777,
		name: 'Zora',
		spokePool: '0x13fdac9f9b4777705db45291bbff3c972c6d1d97',
		isEvm: true,
	},
	{
		chainId: 728126428,
		name: 'TRON',
		spokePool: 'TTbCVPfUZmPhrB9sYC8GKgGBQQEdZovkmS',
		isEvm: false,
	},
	{
		chainId: 34268394551451,
		name: 'Solana',
		spokePool: 'DLv3NggMiSaef97YCkew5xKUHDh13tVGZ7tydt3ZeAru',
		isEvm: false,
	},
] as const satisfies readonly AcrossChainRow[]


// Lookups

export const acrossDepositStatusByStatus = Object.fromEntries(
	acrossDepositStatuses.map((row) => [row.status, row])
)

export const acrossChainByChainId = Object.fromEntries(
	acrossChains.map((row) => [row.chainId, row])
)
