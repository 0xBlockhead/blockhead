/**
 * Dune query read + execute + execution results.
 * @see https://docs.dune.com/api-reference/queries/endpoint/read.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */

import { duneFetch } from '$/sources/Dune/Rest/client.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	DuneExecuteQueryBody,
	DuneExecuteQueryResponse,
	DuneExecutionResult,
	DuneGetExecutionResultsParams,
	DuneQueryMetadata,
} from '$/sources/Dune/Rest/types.ts'

const duneExecutionResultsSearch = (params: DuneGetExecutionResultsParams | undefined) => {
	const search = new URLSearchParams(Object.entries(params ?? {}).flatMap(([key, value]) => (
		value === undefined ? [] : [[key, String(value)]]
	))).toString()
	return search === '' ? '' : `?${search}`
}

/**
 * `GET /api/v1/query/{queryId}` — query metadata (requires plan with API access).
 */
export const getQuery = (
	publicEnv: SourcePublicEnv,
	queryId: number,
	options?: { include_contributors?: boolean }
) => {
	const contributorsQuerySuffix = options?.include_contributors ? '?include_contributors=true' : ''
	return duneFetch<DuneQueryMetadata>(
		publicEnv,
		`/api/v1/query/${queryId}${contributorsQuerySuffix}`
	)
}

/**
 * `POST /api/v1/query/{query_id}/execute` — start run; returns `execution_id`.
 */
export const executeQuery = (
	publicEnv: SourcePublicEnv,
	queryId: number,
	body?: DuneExecuteQueryBody
) => {
	return duneFetch<DuneExecuteQueryResponse>(publicEnv, `/api/v1/query/${queryId}/execute`, {
		method: 'POST',
		body: body != null ? JSON.stringify(body) : undefined,
	})
}

/**
 * `GET /api/v1/execution/{execution_id}/results` — rows + state.
 */
export const getExecutionResults = (
	publicEnv: SourcePublicEnv,
	executionId: string,
	params?: DuneGetExecutionResultsParams
) => {
	return duneFetch<DuneExecutionResult>(
		publicEnv,
		`/api/v1/execution/${executionId}/results${duneExecutionResultsSearch(params)}`
	)
}

/**
 * `GET /api/v1/query/{query_id}/results` — latest cached query result.
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */
export const getLatestQueryResults = (
	publicEnv: SourcePublicEnv,
	queryId: number,
	params?: DuneGetExecutionResultsParams
) => {
	return duneFetch<DuneExecutionResult>(
		publicEnv,
		`/api/v1/query/${queryId}/results${duneExecutionResultsSearch(params)}`
	)
}

/**
 * `POST /api/v1/usage` — billing period credits (metadata; does not consume query credits).
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */
export const getUsage = (
	publicEnv: SourcePublicEnv,
	body?: { start_date?: string; end_date?: string }
) => {
	return duneFetch<{
		billingPeriods?: { credits_used?: number; credits_included?: number }[]
		billing_periods?: { credits_used?: number; credits_included?: number }[]
	}>(publicEnv, '/api/v1/usage', {
		method: 'POST',
		body: JSON.stringify(body ?? {}),
	})
}
