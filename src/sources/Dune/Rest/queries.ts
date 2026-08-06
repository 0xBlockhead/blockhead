/**
 * Dune query read + execute + execution results.
 * @see https://docs.dune.com/api-reference/queries/endpoint/read.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */

import { duneFetch } from '$/sources/Dune/Rest/client.ts'
import {
	duneApiPaths,
	duneExecutionPathSuffixes,
	duneExecutionStatusByState,
	dunePerformanceTierByPerformance,
} from '$/sources/Dune/Rest/constants.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	DuneCancelExecutionResponse,
	DuneExecuteQueryBody,
	DuneExecuteQueryResponse,
	DuneExecutionResult,
	DuneExecutionStatusResponse,
	DuneGetExecutionResultsParams,
	DuneQueryMetadata,
	DuneUsageBillingPeriod,
	DuneUsageResponse,
} from '$/sources/Dune/Rest/types.ts'
import {
	duneCancelExecutionResponseEnvelope,
	duneExecuteQueryResponseEnvelope,
	duneExecutionResultEnvelope,
	duneExecutionStatusEnvelope,
	duneQueryMetadataEnvelope,
	duneUsageResponseEnvelope,
} from '$/sources/Dune/Rest/types.ts'

const omitUndefinedJson = (
	value: unknown
): unknown => {
	if (Array.isArray(value))
		return value.map(omitUndefinedJson)
	if (value != null && typeof value === 'object')
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, entry]) => entry !== undefined)
				.map(([key, entry]) => [
					key,
					omitUndefinedJson(entry),
				])
		)
	return value
}

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(omitUndefinedJson(value))
	} catch {
		throw new Error(`Dune_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

const duneExecutionResultsSearch = (params: DuneGetExecutionResultsParams | undefined) => {
	const search = new URLSearchParams(Object.entries(params ?? {}).flatMap(([key, value]) => (
		value === undefined ? [] : [[key, String(value)]]
	))).toString()
	return search === '' ? '' : `?${search}`
}

const assertExecutionStatus = (state: string | undefined) => {
	if (state == null)
		throw new Error(`Dune_Rest: unknown execution state ${state}`)
	const status = duneExecutionStatusByState[state]
	if (status == null)
		throw new Error(`Dune_Rest: unknown execution state ${state}`)
	return status
}

const assertQueryMetadata = (query: DuneQueryMetadata) => {
	assertEnvelope(duneQueryMetadataEnvelope, query, 'query metadata')
	if (query.query_id == null || !Number.isSafeInteger(query.query_id) || query.query_id < 1)
		throw new Error('Dune_Rest: query response missing query_id')
	return query
}

const assertExecuteQueryResponse = (response: DuneExecuteQueryResponse) => {
	assertEnvelope(duneExecuteQueryResponseEnvelope, response, 'execute query')
	if (response.execution_id.trim() === '')
		throw new Error('Dune_Rest: execute response missing execution_id')
	assertExecutionStatus(response.state)
	return response
}

const assertExecutionResult = (execution: DuneExecutionResult) => {
	assertEnvelope(duneExecutionResultEnvelope, execution, 'execution result')
	if (execution.execution_id.trim() === '')
		throw new Error('Dune_Rest: execution result missing execution_id')
	const status = assertExecutionStatus(execution.state)
	if (execution.result != null && execution.result.rows == null)
		throw new Error('Dune_Rest: execution result missing rows')
	if (
		status.expectsResult
		&& execution.is_execution_finished === true
		&& execution.result == null
	)
		throw new Error('Dune_Rest: completed execution missing result')
	return execution
}

/**
 * `GET /api/v1/query/{queryId}` — query metadata (requires plan with API access).
 */
export const getQuery = async (
	publicEnv: SourcePublicEnv,
	queryId: number,
	options?: { include_contributors?: boolean }
) => {
	if (!Number.isSafeInteger(queryId) || queryId < 1)
		throw new Error(`Dune_Rest: invalid query id ${queryId}`)
	const contributorsQuerySuffix = options?.include_contributors ? '?include_contributors=true' : ''
	return assertQueryMetadata(
		await duneFetch<DuneQueryMetadata>(
			publicEnv,
			`${duneApiPaths.query}/${queryId}${contributorsQuerySuffix}`
		)
	)
}

/**
 * `POST /api/v1/query/{query_id}/execute` — start run; returns `execution_id`.
 */
export const executeQuery = async (
	publicEnv: SourcePublicEnv,
	queryId: number,
	body?: DuneExecuteQueryBody
) => {
	if (!Number.isSafeInteger(queryId) || queryId < 1)
		throw new Error(`Dune_Rest: invalid query id ${queryId}`)
	if (
		body?.performance != null
		&& dunePerformanceTierByPerformance[body.performance] == null
	)
		throw new Error(`Dune_Rest: unknown performance tier ${body.performance}`)
	return assertExecuteQueryResponse(
		await duneFetch<DuneExecuteQueryResponse>(publicEnv, `${duneApiPaths.query}/${queryId}/execute`, {
			method: 'POST',
			body: JSON.stringify(body ?? {}),
		})
	)
}

/**
 * `GET /api/v1/execution/{execution_id}/results` — rows + state.
 */
export const getExecutionResults = async (
	publicEnv: SourcePublicEnv,
	executionId: string,
	params?: DuneGetExecutionResultsParams
) => {
	if (executionId.trim() === '')
		throw new Error('Dune_Rest: invalid execution id')
	return assertExecutionResult(
		await duneFetch<DuneExecutionResult>(
			publicEnv,
			`${duneApiPaths.execution}/${executionId}/${duneExecutionPathSuffixes.results}${duneExecutionResultsSearch(params)}`
		)
	)
}

/**
 * `GET /api/v1/execution/{execution_id}/status` — state + optional failure details (no credit charge).
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-status.md
 */
export const getExecutionStatus = async (
	publicEnv: SourcePublicEnv,
	executionId: string
) => {
	if (executionId.trim() === '')
		throw new Error('Dune_Rest: invalid execution id')
	const status = assertEnvelope<DuneExecutionStatusResponse>(
		duneExecutionStatusEnvelope,
		await duneFetch<DuneExecutionStatusResponse>(
			publicEnv,
			`${duneApiPaths.execution}/${executionId}/${duneExecutionPathSuffixes.status}`
		),
		'execution status'
	)
	if (status.execution_id.trim() === '')
		throw new Error('Dune_Rest: execution status missing execution_id')
	assertExecutionStatus(status.state)
	return status
}

/**
 * `POST /api/v1/execution/{execution_id}/cancel` — cancel a pending/executing run.
 * @see https://docs.dune.com/api-reference/executions/endpoint/cancel-execution.md
 */
export const cancelExecution = async (
	publicEnv: SourcePublicEnv,
	executionId: string
) => {
	if (executionId.trim() === '')
		throw new Error('Dune_Rest: invalid execution id')
	return assertEnvelope<DuneCancelExecutionResponse>(
		duneCancelExecutionResponseEnvelope,
		await duneFetch<DuneCancelExecutionResponse>(
			publicEnv,
			`${duneApiPaths.execution}/${executionId}/${duneExecutionPathSuffixes.cancel}`,
			{
				method: 'POST',
			}
		),
		'cancel execution'
	)
}

/**
 * `GET /api/v1/query/{query_id}/results` — latest cached query result.
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-query-result
 */
export const getLatestQueryResults = async (
	publicEnv: SourcePublicEnv,
	queryId: number,
	params?: DuneGetExecutionResultsParams
) => {
	if (!Number.isSafeInteger(queryId) || queryId < 1)
		throw new Error(`Dune_Rest: invalid query id ${queryId}`)
	return assertExecutionResult(
		await duneFetch<DuneExecutionResult>(
			publicEnv,
			`${duneApiPaths.query}/${queryId}/results${duneExecutionResultsSearch(params)}`
		)
	)
}

/**
 * `POST /api/v1/usage` — billing period credits (metadata; does not consume query credits).
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */
export const getUsage = async (
	publicEnv: SourcePublicEnv,
	body?: { start_date?: string; end_date?: string }
) => (
	assertEnvelope<DuneUsageResponse>(
		duneUsageResponseEnvelope,
		await duneFetch<DuneUsageResponse>(publicEnv, duneApiPaths.usage, {
			method: 'POST',
			body: JSON.stringify(body ?? {}),
		}),
		'usage'
	)
)

/** First billing period that carries at least one credit field; hard-fails empty envelopes. */
export const readUsageCredits = (
	usage: DuneUsageResponse
): DuneUsageBillingPeriod => {
	assertEnvelope(duneUsageResponseEnvelope, usage, 'usage')
	const billingPeriod = usage.billingPeriods?.[0] ?? usage.billing_periods?.[0]
	if (
		billingPeriod == null
		|| (billingPeriod.credits_used == null && billingPeriod.credits_included == null)
	) throw new Error('Dune_Rest: usage response missing billing credits')
	return billingPeriod
}
