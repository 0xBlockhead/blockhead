/**
 * Dune query read + execute + execution results.
 * @see https://docs.dune.com/api-reference/queries/endpoint/read.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */

import { duneFetch } from '$/sources/Dune/Rest/client.ts'
import type {
	DuneExecuteQueryBody,
	DuneExecuteQueryResponse,
	DuneExecutionResult,
	DuneGetExecutionResultsParams,
	DuneQueryMetadata,
} from '$/sources/Dune/Rest/types.ts'

/**
 * `GET /api/v1/query/{queryId}` — query metadata (requires plan with API access).
 */
export async function getQuery(
	queryId: number,
	options?: { include_contributors?: boolean },
): Promise<DuneQueryMetadata> {
	const q = options?.include_contributors ? '?include_contributors=true' : ''
	return duneFetch<DuneQueryMetadata>(`/api/v1/query/${queryId}${q}`)
}

/**
 * `POST /api/v1/query/{query_id}/execute` — start run; returns `execution_id`.
 */
export async function executeQuery(
	queryId: number,
	body?: DuneExecuteQueryBody,
): Promise<DuneExecuteQueryResponse> {
	return duneFetch<DuneExecuteQueryResponse>(`/api/v1/query/${queryId}/execute`, {
		method: 'POST',
		body: body != null ? JSON.stringify(body) : undefined,
	})
}

/**
 * `GET /api/v1/execution/{execution_id}/results` — rows + state.
 */
export async function getExecutionResults(
	executionId: string,
	params?: DuneGetExecutionResultsParams,
): Promise<DuneExecutionResult> {
	if (params == null) {
		return duneFetch<DuneExecutionResult>(`/api/v1/execution/${executionId}/results`)
	}
	const q = new URLSearchParams()
	if (params.allow_partial_results !== undefined) {
		q.set('allow_partial_results', String(params.allow_partial_results))
	}
	if (params.columns !== undefined) q.set('columns', params.columns)
	if (params.filters !== undefined) q.set('filters', params.filters)
	if (params.ignore_max_credits_per_request !== undefined) {
		q.set('ignore_max_credits_per_request', String(params.ignore_max_credits_per_request))
	}
	if (params.limit !== undefined) q.set('limit', String(params.limit))
	if (params.offset !== undefined) q.set('offset', String(params.offset))
	if (params.sample_count !== undefined) q.set('sample_count', String(params.sample_count))
	if (params.sort_by !== undefined) q.set('sort_by', params.sort_by)
	const search = q.toString()
	return duneFetch<DuneExecutionResult>(
		`/api/v1/execution/${executionId}/results${search ? `?${search}` : ''}`,
	)
}

/**
 * `GET /api/v1/query/{query_id}/results` — latest cached query result.
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */
export async function getLatestQueryResults(
	queryId: number,
	params?: DuneGetExecutionResultsParams,
): Promise<DuneExecutionResult> {
	if (params == null) {
		return duneFetch<DuneExecutionResult>(`/api/v1/query/${queryId}/results`)
	}

	const q = new URLSearchParams()
	if (params.allow_partial_results !== undefined) {
		q.set('allow_partial_results', String(params.allow_partial_results))
	}
	if (params.columns !== undefined) q.set('columns', params.columns)
	if (params.filters !== undefined) q.set('filters', params.filters)
	if (params.ignore_max_credits_per_request !== undefined) {
		q.set('ignore_max_credits_per_request', String(params.ignore_max_credits_per_request))
	}
	if (params.limit !== undefined) q.set('limit', String(params.limit))
	if (params.offset !== undefined) q.set('offset', String(params.offset))
	if (params.sample_count !== undefined) q.set('sample_count', String(params.sample_count))
	if (params.sort_by !== undefined) q.set('sort_by', params.sort_by)
	const search = q.toString()

	return duneFetch<DuneExecutionResult>(
		`/api/v1/query/${queryId}/results${search ? `?${search}` : ''}`,
	)
}

/**
 * `POST /api/v1/usage` — billing period credits (metadata; does not consume query credits).
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */
export async function getUsage(body?: { start_date?: string; end_date?: string }) {
	return duneFetch<{
		billingPeriods?: { credits_used?: number; credits_included?: number }[]
		billing_periods?: { credits_used?: number; credits_included?: number }[]
	}>('/api/v1/usage', {
		method: 'POST',
		body: JSON.stringify(body ?? {}),
	})
}
