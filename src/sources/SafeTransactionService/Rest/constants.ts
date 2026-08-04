/**
 * Safe Transaction Service EIP-155 hosts (api.safe.global tx-service path slugs).
 *
 * Catalog rows are the intersection of:
 * - per-network OpenAPI reference pages under
 *   https://docs.safe.global/core-api/transaction-service-reference/
 * - `transactionService` locators from Safe Client Gateway
 *   `GET https://safe-client.safe.global/v1/chains`
 *
 * URL shape: `https://api.safe.global/tx-service/{pathSlug}`
 * @see https://docs.safe.global/core-api/how-to-use-api-keys
 */


// Types

type SafeTransactionServiceHost = {
	chainId: number
	pathSlug: string
	label: string
	baseUrl: `https://api.safe.global/tx-service/${string}`
}


// Constants

export const safeTransactionServiceHosts = [
	{
		chainId: 1,
		pathSlug: 'eth',
		label: 'Ethereum',
		baseUrl: 'https://api.safe.global/tx-service/eth',
	},
	{
		chainId: 10,
		pathSlug: 'oeth',
		label: 'OP Mainnet',
		baseUrl: 'https://api.safe.global/tx-service/oeth',
	},
	{
		chainId: 50,
		pathSlug: 'xdc',
		label: 'XDC Network',
		baseUrl: 'https://api.safe.global/tx-service/xdc',
	},
	{
		chainId: 56,
		pathSlug: 'bnb',
		label: 'BNB Chain',
		baseUrl: 'https://api.safe.global/tx-service/bnb',
	},
	{
		chainId: 100,
		pathSlug: 'gno',
		label: 'Gnosis Chain',
		baseUrl: 'https://api.safe.global/tx-service/gno',
	},
	{
		chainId: 130,
		pathSlug: 'unichain',
		label: 'Unichain',
		baseUrl: 'https://api.safe.global/tx-service/unichain',
	},
	{
		chainId: 137,
		pathSlug: 'pol',
		label: 'Polygon',
		baseUrl: 'https://api.safe.global/tx-service/pol',
	},
	{
		chainId: 143,
		pathSlug: 'monad',
		label: 'Monad',
		baseUrl: 'https://api.safe.global/tx-service/monad',
	},
	{
		chainId: 146,
		pathSlug: 'sonic',
		label: 'Sonic',
		baseUrl: 'https://api.safe.global/tx-service/sonic',
	},
	{
		chainId: 196,
		pathSlug: 'okb',
		label: 'X Layer',
		baseUrl: 'https://api.safe.global/tx-service/okb',
	},
	{
		chainId: 204,
		pathSlug: 'opbnb',
		label: 'opBNB',
		baseUrl: 'https://api.safe.global/tx-service/opbnb',
	},
	{
		chainId: 232,
		pathSlug: 'lens',
		label: 'Lens',
		baseUrl: 'https://api.safe.global/tx-service/lens',
	},
	{
		chainId: 324,
		pathSlug: 'zksync',
		label: 'zkSync Era',
		baseUrl: 'https://api.safe.global/tx-service/zksync',
	},
	{
		chainId: 480,
		pathSlug: 'wc',
		label: 'World Chain',
		baseUrl: 'https://api.safe.global/tx-service/wc',
	},
	{
		chainId: 677,
		pathSlug: 'bot',
		label: 'BOT Chain Mainnet',
		baseUrl: 'https://api.safe.global/tx-service/bot',
	},
	{
		chainId: 988,
		pathSlug: 'stable',
		label: 'Stable',
		baseUrl: 'https://api.safe.global/tx-service/stable',
	},
	{
		chainId: 999,
		pathSlug: 'hyper',
		label: 'HyperEVM',
		baseUrl: 'https://api.safe.global/tx-service/hyper',
	},
	{
		chainId: 1001,
		pathSlug: 'kairos',
		label: 'Kairos',
		baseUrl: 'https://api.safe.global/tx-service/kairos',
	},
	{
		chainId: 1672,
		pathSlug: 'pharos',
		label: 'Pharos',
		baseUrl: 'https://api.safe.global/tx-service/pharos',
	},
	{
		chainId: 3338,
		pathSlug: 'peaq',
		label: 'peaq',
		baseUrl: 'https://api.safe.global/tx-service/peaq',
	},
	{
		chainId: 4217,
		pathSlug: 'tempo',
		label: 'Tempo',
		baseUrl: 'https://api.safe.global/tx-service/tempo',
	},
	{
		chainId: 4326,
		pathSlug: 'mega',
		label: 'MegaETH',
		baseUrl: 'https://api.safe.global/tx-service/mega',
	},
	{
		chainId: 4663,
		pathSlug: 'robinhood',
		label: 'Robinhood Chain',
		baseUrl: 'https://api.safe.global/tx-service/robinhood',
	},
	{
		chainId: 5000,
		pathSlug: 'mantle',
		label: 'Mantle',
		baseUrl: 'https://api.safe.global/tx-service/mantle',
	},
	{
		chainId: 5003,
		pathSlug: 'mnt-sep',
		label: 'Mantle Sepolia',
		baseUrl: 'https://api.safe.global/tx-service/mnt-sep',
	},
	{
		chainId: 5042,
		pathSlug: 'arc',
		label: 'Arc',
		baseUrl: 'https://api.safe.global/tx-service/arc',
	},
	{
		chainId: 8217,
		pathSlug: 'kaia',
		label: 'Kaia',
		baseUrl: 'https://api.safe.global/tx-service/kaia',
	},
	{
		chainId: 8453,
		pathSlug: 'base',
		label: 'Base',
		baseUrl: 'https://api.safe.global/tx-service/base',
	},
	{
		chainId: 9745,
		pathSlug: 'plasma',
		label: 'Plasma',
		baseUrl: 'https://api.safe.global/tx-service/plasma',
	},
	{
		chainId: 10143,
		pathSlug: 'monad-testnet',
		label: 'Monad Testnet',
		baseUrl: 'https://api.safe.global/tx-service/monad-testnet',
	},
	{
		chainId: 10200,
		pathSlug: 'chi',
		label: 'Gnosis Chiado',
		baseUrl: 'https://api.safe.global/tx-service/chi',
	},
	{
		chainId: 16661,
		pathSlug: '0g',
		label: '0G',
		baseUrl: 'https://api.safe.global/tx-service/0g',
	},
	{
		chainId: 25363,
		pathSlug: 'fluent',
		label: 'Fluent',
		baseUrl: 'https://api.safe.global/tx-service/fluent',
	},
	{
		chainId: 42161,
		pathSlug: 'arb1',
		label: 'Arbitrum',
		baseUrl: 'https://api.safe.global/tx-service/arb1',
	},
	{
		chainId: 42220,
		pathSlug: 'celo',
		label: 'Celo',
		baseUrl: 'https://api.safe.global/tx-service/celo',
	},
	{
		chainId: 42431,
		pathSlug: 'tempo-moderato',
		label: 'Tempo Moderato',
		baseUrl: 'https://api.safe.global/tx-service/tempo-moderato',
	},
	{
		chainId: 43111,
		pathSlug: 'hemi',
		label: 'Hemi',
		baseUrl: 'https://api.safe.global/tx-service/hemi',
	},
	{
		chainId: 43114,
		pathSlug: 'avax',
		label: 'Avalanche',
		baseUrl: 'https://api.safe.global/tx-service/avax',
	},
	{
		chainId: 46630,
		pathSlug: 'robinhood-testnet',
		label: 'Robinhood Testnet',
		baseUrl: 'https://api.safe.global/tx-service/robinhood-testnet',
	},
	{
		chainId: 57073,
		pathSlug: 'ink',
		label: 'Ink',
		baseUrl: 'https://api.safe.global/tx-service/ink',
	},
	{
		chainId: 59144,
		pathSlug: 'linea',
		label: 'Linea',
		baseUrl: 'https://api.safe.global/tx-service/linea',
	},
	{
		chainId: 80069,
		pathSlug: 'bep',
		label: 'Bepolia',
		baseUrl: 'https://api.safe.global/tx-service/bep',
	},
	{
		chainId: 80094,
		pathSlug: 'berachain',
		label: 'Berachain',
		baseUrl: 'https://api.safe.global/tx-service/berachain',
	},
	{
		chainId: 81224,
		pathSlug: 'codex',
		label: 'Codex',
		baseUrl: 'https://api.safe.global/tx-service/codex',
	},
	{
		chainId: 84532,
		pathSlug: 'basesep',
		label: 'Base Sepolia',
		baseUrl: 'https://api.safe.global/tx-service/basesep',
	},
	{
		chainId: 102030,
		pathSlug: 'ctc',
		label: 'Creditcoin',
		baseUrl: 'https://api.safe.global/tx-service/ctc',
	},
	{
		chainId: 534352,
		pathSlug: 'scr',
		label: 'Scroll',
		baseUrl: 'https://api.safe.global/tx-service/scr',
	},
	{
		chainId: 747474,
		pathSlug: 'katana',
		label: 'Katana',
		baseUrl: 'https://api.safe.global/tx-service/katana',
	},
	{
		chainId: 5042002,
		pathSlug: 'arc-testnet',
		label: 'Arc Testnet',
		baseUrl: 'https://api.safe.global/tx-service/arc-testnet',
	},
	{
		chainId: 11142220,
		pathSlug: 'celo-sep',
		label: 'Celo Sepolia Testnet',
		baseUrl: 'https://api.safe.global/tx-service/celo-sep',
	},
	{
		chainId: 11155111,
		pathSlug: 'sep',
		label: 'Sepolia',
		baseUrl: 'https://api.safe.global/tx-service/sep',
	},
	{
		chainId: 1313161554,
		pathSlug: 'aurora',
		label: 'Aurora',
		baseUrl: 'https://api.safe.global/tx-service/aurora',
	},
] as const satisfies readonly SafeTransactionServiceHost[]


// Lookups

export const safeTransactionServiceHostByChainId = Object.fromEntries(
	safeTransactionServiceHosts.map((host) => [
		host.chainId,
		host,
	])
)
