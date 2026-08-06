/**
 * Axelarscan GMP `searchGMP` page limits + status catalogs + EVM chain keys.
 * Page size max verified live against api.axelarscan.io (size > 25 → 400).
 * Wire statuses from axelarjs `GMPTxStatus` (`packages/api/src/gmp/types.ts`).
 * EVM chain keys match Axelarscan `call.chain` / destinationChain identifiers.
 */


// Types

type AxelarscanGmpStatusRow = {
	status: (
		| 'called'
		| 'confirming'
		| 'confirmable'
		| 'express_executed'
		| 'confirmed'
		| 'approving'
		| 'approvable'
		| 'approved'
		| 'executing'
		| 'executed'
		| 'error'
		| 'express_executable'
		| 'express_executable_without_gas_paid'
		| 'executable'
		| 'executable_without_gas_paid'
		| 'insufficient_fee'
	)
	label: string
}

type AxelarscanGmpSimplifiedStatusRow = {
	simplifiedStatus: (
		| 'sent'
		| 'received'
		| 'approved'
		| 'failed'
	)
	label: string
}

type AxelarscanEvmChainRow = {
	chainKey: string
	chainId: number
}


// Constants

export const axelarscanGmpPageLimits = {
	defaultSize: 25,
	maxSize: 25,
	maxFrom: 100_000,
} as const

export const axelarscanGmpStatuses = [
	{
		status: 'called',
		label: 'Source contract call recorded',
	},
	{
		status: 'confirming',
		label: 'Awaiting Axelar confirmation',
	},
	{
		status: 'confirmable',
		label: 'Ready for Axelar confirmation',
	},
	{
		status: 'express_executed',
		label: 'Express-executed on destination',
	},
	{
		status: 'confirmed',
		label: 'Confirmed by Axelar validators',
	},
	{
		status: 'approving',
		label: 'Awaiting destination approval',
	},
	{
		status: 'approvable',
		label: 'Ready for destination approval',
	},
	{
		status: 'approved',
		label: 'Approved on destination',
	},
	{
		status: 'executing',
		label: 'Executing on destination',
	},
	{
		status: 'executed',
		label: 'Executed on destination',
	},
	{
		status: 'error',
		label: 'Execution or confirmation error',
	},
	{
		status: 'express_executable',
		label: 'Ready for express execution',
	},
	{
		status: 'express_executable_without_gas_paid',
		label: 'Express-executable without gas payment',
	},
	{
		status: 'executable',
		label: 'Ready for destination execution',
	},
	{
		status: 'executable_without_gas_paid',
		label: 'Executable without gas fee paid',
	},
	{
		status: 'insufficient_fee',
		label: 'Insufficient gas fee',
	},
] as const satisfies readonly AxelarscanGmpStatusRow[]

export const axelarscanGmpSimplifiedStatuses = [
	{
		simplifiedStatus: 'sent',
		label: 'Source call observed; destination incomplete',
	},
	{
		simplifiedStatus: 'approved',
		label: 'Approved on destination; execution pending',
	},
	{
		simplifiedStatus: 'received',
		label: 'Received on destination',
	},
	{
		simplifiedStatus: 'failed',
		label: 'Failed',
	},
] as const satisfies readonly AxelarscanGmpSimplifiedStatusRow[]

export const axelarscanEvmChains = [
	{ chainKey: 'ethereum', chainId: 1 },
	{ chainKey: 'binance', chainId: 56 },
	{ chainKey: 'avalanche', chainId: 43114 },
	{ chainKey: 'polygon', chainId: 137 },
	{ chainKey: 'arbitrum', chainId: 42161 },
	{ chainKey: 'optimism', chainId: 10 },
	{ chainKey: 'fantom', chainId: 250 },
	{ chainKey: 'moonbeam', chainId: 1284 },
	{ chainKey: 'celo', chainId: 42220 },
	{ chainKey: 'kava', chainId: 2222 },
	{ chainKey: 'filecoin', chainId: 314 },
	{ chainKey: 'linea', chainId: 59144 },
	{ chainKey: 'base', chainId: 8453 },
	{ chainKey: 'mantle', chainId: 5000 },
	{ chainKey: 'scroll', chainId: 534352 },
	{ chainKey: 'blast', chainId: 81457 },
	{ chainKey: 'fraxtal', chainId: 252 },
	{ chainKey: 'immutable', chainId: 13371 },
	{ chainKey: 'sei', chainId: 1329 },
	{ chainKey: 'centrifuge', chainId: 2031 },
	{ chainKey: 'aurora', chainId: 1313161554 },
	{ chainKey: 'polygon-zkevm', chainId: 1101 },
	{ chainKey: 'bsc', chainId: 56 },
] as const satisfies readonly AxelarscanEvmChainRow[]


// Lookups

export const axelarscanGmpStatusByStatus = Object.fromEntries(
	axelarscanGmpStatuses.map((row) => [row.status, row])
)

export const axelarscanGmpSimplifiedStatusBySimplifiedStatus = Object.fromEntries(
	axelarscanGmpSimplifiedStatuses.map((row) => [row.simplifiedStatus, row])
)

export const axelarscanEvmChainIdByChainKey = Object.fromEntries(
	axelarscanEvmChains.map((row) => [row.chainKey, row.chainId])
)
