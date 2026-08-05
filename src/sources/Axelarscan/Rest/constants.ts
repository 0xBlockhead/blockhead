/**
 * Axelarscan GMP `searchGMP` page limits + status catalogs.
 * Page size max verified live against api.axelarscan.io (size > 25 → 400).
 * Wire statuses from axelarjs `GMPTxStatus` (`packages/api/src/gmp/types.ts`).
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
		label: 'Executable without gas payment',
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


// Lookups

export const axelarscanGmpStatusByStatus = Object.fromEntries(
	axelarscanGmpStatuses.map((row) => [row.status, row])
)

export const axelarscanGmpSimplifiedStatusBySimplifiedStatus = Object.fromEntries(
	axelarscanGmpSimplifiedStatuses.map((row) => [row.simplifiedStatus, row])
)
