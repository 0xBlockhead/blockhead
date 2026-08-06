/**
 * Dune REST catalogs — execution states, performance tiers, API path prefixes.
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */


// Types

type DuneExecutionStatusRow = {
	state: (
		| 'QUERY_STATE_PENDING'
		| 'QUERY_STATE_EXECUTING'
		| 'QUERY_STATE_COMPLETED'
		| 'QUERY_STATE_COMPLETED_PARTIAL'
		| 'QUERY_STATE_FAILED'
		| 'QUERY_STATE_EXPIRED'
		| 'QUERY_STATE_CANCELED'
	)
	label: string
	terminal: boolean
	expectsResult: boolean
}

type DunePerformanceTierRow = {
	performance: 'small' | 'medium' | 'large'
	label: string
}


// Constants

export const duneExecutionStatuses = [
	{
		state: 'QUERY_STATE_PENDING',
		label: 'Queued; not yet executing',
		terminal: false,
		expectsResult: false,
	},
	{
		state: 'QUERY_STATE_EXECUTING',
		label: 'Running on a Dune engine',
		terminal: false,
		expectsResult: false,
	},
	{
		state: 'QUERY_STATE_COMPLETED',
		label: 'Finished with full result set',
		terminal: true,
		expectsResult: true,
	},
	{
		state: 'QUERY_STATE_COMPLETED_PARTIAL',
		label: 'Finished with truncated/partial result set',
		terminal: true,
		expectsResult: true,
	},
	{
		state: 'QUERY_STATE_FAILED',
		label: 'Failed during execution',
		terminal: true,
		expectsResult: false,
	},
	{
		state: 'QUERY_STATE_EXPIRED',
		label: 'Result expired from storage',
		terminal: true,
		expectsResult: false,
	},
	{
		state: 'QUERY_STATE_CANCELED',
		label: 'Canceled before completion',
		terminal: true,
		expectsResult: false,
	},
] as const satisfies readonly DuneExecutionStatusRow[]

export const dunePerformanceTiers = [
	{
		performance: 'small',
		label: 'Small engine tier',
	},
	{
		performance: 'medium',
		label: 'Medium engine tier (default)',
	},
	{
		performance: 'large',
		label: 'Large engine tier',
	},
] as const satisfies readonly DunePerformanceTierRow[]

/** Path prefixes for modeled Dune REST endpoints (appended by queries). */
export const duneApiPaths = {
	query: '/api/v1/query',
	execution: '/api/v1/execution',
	usage: '/api/v1/usage',
} as const

/** Relative suffixes under `/api/v1/execution/{execution_id}/…`. */
export const duneExecutionPathSuffixes = {
	results: 'results',
	status: 'status',
	cancel: 'cancel',
} as const


// Lookups

export const duneExecutionStatusByState = Object.fromEntries(
	duneExecutionStatuses.map((row) => [
		row.state,
		row,
	])
)

export const dunePerformanceTierByPerformance = Object.fromEntries(
	dunePerformanceTiers.map((row) => [
		row.performance,
		row,
	])
)
