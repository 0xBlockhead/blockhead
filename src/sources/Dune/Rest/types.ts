import type { JsonValue } from '$/typescript/JsonValue.ts'
/**
 * Dune API shapes (read / execute / execution results).
 * @see https://docs.dune.com/api-reference/queries/endpoint/read.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/execute-query.md
 * @see https://docs.dune.com/api-reference/executions/endpoint/get-execution-result.md
 */

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

export type DuneExecutionStatus =
	| 'QUERY_STATE_PENDING'
	| 'QUERY_STATE_EXECUTING'
	| 'QUERY_STATE_COMPLETED'
	| 'QUERY_STATE_COMPLETED_PARTIAL'
	| 'QUERY_STATE_FAILED'
	| 'QUERY_STATE_EXPIRED'
	| 'QUERY_STATE_CANCELED'

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

export type DuneExecuteQueryBody = {
	query_parameters?: Record<string, JsonValue>
	performance?: 'medium' | 'large'
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
