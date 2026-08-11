import { type as arktype } from 'arktype'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	duneExecutionStatuses,
	dunePerformanceTiers,
} from '$/sources/Dune/Rest/constants.ts'
/**
 * Dune API shapes (read / execute / execution results).
 * @see https://docs.dune.com/api-reference/queries/endpoint/read.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 */

export type DuneExecutionStatus = (typeof duneExecutionStatuses)[number]['state']

export type DunePerformanceTier = (typeof dunePerformanceTiers)[number]['performance']

const duneExecutionStateWire = arktype(
	"'QUERY_STATE_PENDING' | 'QUERY_STATE_EXECUTING' | 'QUERY_STATE_COMPLETED' | 'QUERY_STATE_COMPLETED_PARTIAL' | 'QUERY_STATE_FAILED' | 'QUERY_STATE_EXPIRED' | 'QUERY_STATE_CANCELED'"
)

const dunePerformanceTierWire = arktype("'small' | 'medium' | 'large'")

export const duneQueryMetadataEnvelope = arktype({
	query_id: 'number.integer >= 1',
	'name?': 'string',
	'description?': 'string',
	'query_sql?': 'string',
	'is_archived?': 'boolean',
	'is_private?': 'boolean',
	'is_temp?': 'boolean',
	'is_unsaved?': 'boolean',
	'owner?': 'string',
	'parameters?': arktype({
		'key?': 'string',
		'type?': 'string',
		'value?': 'string',
		'description?': 'string',
		'enumOptions?': 'string[]',
		'enumFromResults?': {
			'columnName?': 'string',
			'queryId?': 'number',
		},
		'isFreeformAllowed?': 'boolean',
		'isMultiselect?': 'boolean',
		'values?': 'string[]',
	}).array(),
	'query_engine?': 'string',
	'tags?': 'string[]',
	'version?': 'number',
	'contributors?': arktype({
		'handle?': 'string',
		'contribution_count?': 'number',
	}).array(),
})

export const duneExecuteQueryResponseEnvelope = arktype({
	execution_id: 'string',
	state: duneExecutionStateWire,
})

const duneExecutionResultMetadataEnvelope = arktype({
	'column_names?': 'string[]',
	'column_types?': 'string[]',
	'datapoint_count?': 'number',
	'execution_time_millis?': 'number',
	'pending_time_millis?': 'number',
	'result_set_bytes?': 'number',
	'row_count?': 'number',
	'total_result_set_bytes?': 'number',
	'total_row_count?': 'number',
})

const duneQueryResultDataEnvelope = arktype({
	rows: arktype('Record<string, unknown>[]'),
	'metadata?': duneExecutionResultMetadataEnvelope,
	'update_type?': 'string',
})

const duneQueryResultErrorEnvelope = arktype({
	'message?': 'string',
	'type?': 'string',
	'metadata?': {
		'line?': 'number',
		'column?': 'number',
	},
})

export const duneExecutionResultEnvelope = arktype({
	execution_id: 'string',
	state: duneExecutionStateWire,
	'query_id?': 'number',
	'submitted_at?': 'string',
	'expires_at?': 'string',
	'execution_started_at?': 'string',
	'execution_ended_at?': 'string',
	'cancelled_at?': 'string',
	'is_execution_finished?': 'boolean',
	'next_offset?': 'number',
	'next_uri?': 'string',
	'result?': duneQueryResultDataEnvelope,
	'error?': duneQueryResultErrorEnvelope,
})

/** Status endpoint — no result rows; may include credit cost + failure details. */
export const duneExecutionStatusEnvelope = arktype({
	execution_id: 'string',
	state: duneExecutionStateWire,
	'query_id?': 'number',
	'submitted_at?': 'string',
	'expires_at?': 'string',
	'execution_started_at?': 'string',
	'execution_ended_at?': 'string',
	'cancelled_at?': 'string',
	'is_execution_finished?': 'boolean',
	'execution_cost_credits?': 'number',
	'error?': duneQueryResultErrorEnvelope,
})

export const duneCancelExecutionResponseEnvelope = arktype({
	success: 'boolean',
})

export const duneUsageBillingPeriodEnvelope = arktype({
	'credits_used?': 'number',
	'credits_included?': 'number',
	'start_date?': 'string',
	'end_date?': 'string',
})

export const duneUsageResponseEnvelope = arktype({
	'billingPeriods?': duneUsageBillingPeriodEnvelope.array(),
	'billing_periods?': duneUsageBillingPeriodEnvelope.array(),
})

export type DuneQueryMetadata = {
	query_id?: number
	name?: string
	description?: string
	query_sql?: string
	is_archived?: boolean
	is_private?: boolean
	is_temp?: boolean
	is_unsaved?: boolean
	owner?: string
	parameters?: DuneQueryParameter[]
	query_engine?: string
	tags?: string[]
	version?: number
	contributors?: DuneQueryContributor[]
}

export type DuneQueryParameter = {
	key?: string
	type?: string
	value?: string
	description?: string
	enumOptions?: string[]
	enumFromResults?: { columnName?: string; queryId?: number }
	isFreeformAllowed?: boolean
	isMultiselect?: boolean
	values?: string[]
}

export type DuneQueryContributor = {
	handle?: string
	contribution_count?: number
}

export type DuneExecuteQueryResponse = {
	execution_id: string
	state: DuneExecutionStatus
}

export type DuneQueryResultData = {
	rows: Record<string, JsonValue>[]
	metadata?: DuneExecutionResultMetadata
	update_type?: string
}

export type DuneExecutionResultMetadata = {
	column_names?: string[]
	column_types?: string[]
	datapoint_count?: number
	execution_time_millis?: number
	pending_time_millis?: number
	result_set_bytes?: number
	row_count?: number
	total_result_set_bytes?: number
	total_row_count?: number
}

export type DuneQueryResultError = {
	message?: string
	type?: string
	metadata?: { line?: number; column?: number }
}

export type DuneExecutionResult = {
	execution_id: string
	state: DuneExecutionStatus
	query_id?: number
	submitted_at?: string
	expires_at?: string
	execution_started_at?: string
	execution_ended_at?: string
	cancelled_at?: string
	is_execution_finished?: boolean
	next_offset?: number
	next_uri?: string
	result?: DuneQueryResultData
	error?: DuneQueryResultError
}

export type DuneExecutionStatusResponse = {
	execution_id: string
	state: DuneExecutionStatus
	query_id?: number
	submitted_at?: string
	expires_at?: string
	execution_started_at?: string
	execution_ended_at?: string
	cancelled_at?: string
	is_execution_finished?: boolean
	execution_cost_credits?: number
	error?: DuneQueryResultError
}

export type DuneCancelExecutionResponse = {
	success: boolean
}

export type DuneExecuteQueryBody = {
	query_parameters?: Record<string, JsonValue>
	performance?: DunePerformanceTier
}

export type DuneGetExecutionResultsParams = {
	allow_partial_results?: boolean
	columns?: string
	filters?: string
	ignore_max_credits_per_request?: boolean
	limit?: number
	offset?: number
	sample_count?: number
	sort_by?: string
}

export type DuneUsageBillingPeriod = {
	credits_used?: number
	credits_included?: number
	start_date?: string
	end_date?: string
}

/** `POST /api/v1/usage` — camelCase or snake_case billing periods per plan/docs. */
export type DuneUsageResponse = {
	billingPeriods?: DuneUsageBillingPeriod[]
	billing_periods?: DuneUsageBillingPeriod[]
}
