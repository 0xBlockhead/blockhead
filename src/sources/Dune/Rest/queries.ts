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

const appendDuneExecutionResultsSearchParams = (
	searchParams: URLSearchParams,
	params: DuneGetExecutionResultsParams
) => {
	if (params.allow_partial_results !== undefined) {
		searchParams.set('allow_partial_results', String(params.allow_partial_results))
	}
	if (params.columns !== undefined) searchParams.set('columns', params.columns)
	if (params.filters !== undefined) searchParams.set('filters', params.filters)
	if (params.ignore_max_credits_per_request !== undefined) {
		searchParams.set('ignore_max_credits_per_request', String(params.ignore_max_credits_per_request))
	}
	if (params.limit !== undefined) searchParams.set('limit', String(params.limit))
	if (params.offset !== undefined) searchParams.set('offset', String(params.offset))
	if (params.sample_count !== undefined) searchParams.set('sample_count', String(params.sample_count))
	if (params.sort_by !== undefined) searchParams.set('sort_by', params.sort_by)
}

/**
 * `GET /api/v1/query/{queryId}` — query metadata (requires plan with API access).
 */
export async function getQuery(
	publicEnv: SourcePublicEnv,
	queryId: number,
	options?: { include_contributors?: boolean }
): Promise<DuneQueryMetadata> {
	const contributorsQuerySuffix = options?.include_contributors ? '?include_contributors=true' : ''
	return duneFetch<DuneQueryMetadata>(
		publicEnv,
		`/api/v1/query/${queryId}${contributorsQuerySuffix}`
	)
}

/**
 * `POST /api/v1/query/{query_id}/execute` — start run; returns `execution_id`.
 */
export async function executeQuery(
	publicEnv: SourcePublicEnv,
	queryId: number,
	body?: DuneExecuteQueryBody
): Promise<DuneExecuteQueryResponse> {
	return duneFetch<DuneExecuteQueryResponse>(publicEnv, `/api/v1/query/${queryId}/execute`, {
		method: 'POST',
		body: body != null ? JSON.stringify(body) : undefined,
	})
}

/**
 * `GET /api/v1/execution/{execution_id}/results` — rows + state.
 */
export async function getExecutionResults(
	publicEnv: SourcePublicEnv,
	executionId: string,
	params?: DuneGetExecutionResultsParams
): Promise<DuneExecutionResult> {
	if (params == null) {
		return duneFetch<DuneExecutionResult>(publicEnv, `/api/v1/execution/${executionId}/results`)
	}
	const searchParams = new URLSearchParams()
	appendDuneExecutionResultsSearchParams(searchParams, params)
	const search = searchParams.toString()
	return duneFetch<DuneExecutionResult>(
		publicEnv,
		`/api/v1/execution/${executionId}/results${search ? `?${search}` : ''}`
	)
}

/**
 * `GET /api/v1/query/{query_id}/results` — latest cached query result.
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */
export async function getLatestQueryResults(
	publicEnv: SourcePublicEnv,
	queryId: number,
	params?: DuneGetExecutionResultsParams
): Promise<DuneExecutionResult> {
	if (params == null) {
		return duneFetch<DuneExecutionResult>(publicEnv, `/api/v1/query/${queryId}/results`)
	}

	const searchParams = new URLSearchParams()
	appendDuneExecutionResultsSearchParams(searchParams, params)
	const search = searchParams.toString()

	return duneFetch<DuneExecutionResult>(
		publicEnv,
		`/api/v1/query/${queryId}/results${search ? `?${search}` : ''}`
	)
}

/**
 * `POST /api/v1/usage` — billing period credits (metadata; does not consume query credits).
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */
export async function getUsage(
	publicEnv: SourcePublicEnv,
	body?: { start_date?: string; end_date?: string }
) {
	return duneFetch<{
		billingPeriods?: { credits_used?: number; credits_included?: number }[]
		billing_periods?: { credits_used?: number; credits_included?: number }[]
	}>(publicEnv, '/api/v1/usage', {
		method: 'POST',
		body: JSON.stringify(body ?? {}),
	})
}
