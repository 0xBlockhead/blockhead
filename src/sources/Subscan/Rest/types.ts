import { type as arktype } from 'arktype'


export const subscanUnsignedDecimal = '/^(0|[1-9]\\d*)$/'

export const subscanNonnegativeIntegerWire = arktype('number.integer >= 0')

export const subscanBlockWire = arktype({
	block_num: 'number.integer >= 0',
	block_hash: 'string > 0',
	parent_hash: 'string > 0',
	'state_root?': 'string > 0',
	'extrinsics_root?': 'string > 0',
	'event_count?': 'number.integer >= 0',
	'extrinsics_count?': 'number.integer >= 0',
})

export type SubscanBlock = typeof subscanBlockWire.infer

export const subscanExtrinsicWire = arktype({
	block_num: 'number.integer >= 0',
	'block_timestamp?': 'number.integer >= 0',
	extrinsic_index: 'string > 0',
	call_module: 'string > 0',
	call_module_function: 'string > 0',
	'account_id?': 'string',
	'extrinsic_hash?': 'string',
	'fee?': subscanUnsignedDecimal,
	'finalized?': 'boolean',
	'nonce?': 'number.integer >= 0',
	success: 'boolean',
})

export type SubscanExtrinsic = typeof subscanExtrinsicWire.infer

export const subscanExtrinsicListWire = arktype({
	count: 'number.integer >= 0',
	extrinsics: subscanExtrinsicWire.array(),
})

export type SubscanExtrinsicList = typeof subscanExtrinsicListWire.infer

export const subscanReferendumTimelineWire = arktype({
	block: 'number.integer >= 0',
	status: 'string > 0',
	time: 'number.integer >= 0',
})

export type SubscanReferendumTimeline = typeof subscanReferendumTimelineWire.infer

export const subscanReferendumWire = arktype({
	referendum_index: 'number.integer >= 0',
	origins: 'string > 0',
	created_block: 'number.integer >= 0',
	latest_block_num: 'number.integer >= 0',
	latest_block_timestamp: 'number.integer >= 0',
	status: 'string > 0',
	ayes_amount: subscanUnsignedDecimal,
	nays_amount: subscanUnsignedDecimal,
	timeline: subscanReferendumTimelineWire.array(),
	'support?': 'number >= 0',
	'approval?': 'number >= 0',
})

export type SubscanReferendum = typeof subscanReferendumWire.infer

export const subscanReferendumListItemWire = arktype({
	referendum_index: 'number.integer >= 0',
	origins: 'string > 0',
	created_block: 'number.integer >= 0',
	latest_block_num: 'number.integer >= 0',
	latest_block_timestamp: 'number.integer >= 0',
	status: 'string > 0',
})

export type SubscanReferendumListItem = typeof subscanReferendumListItemWire.infer

export const subscanReferendumListWire = arktype({
	count: 'number.integer >= 0',
	list: subscanReferendumListItemWire.array(),
})

export type SubscanReferendumList = typeof subscanReferendumListWire.infer

export const subscanBlockListItemWire = arktype({
	block_num: 'number.integer >= 0',
	hash: 'string > 0',
	'block_timestamp?': 'number.integer >= 0',
	'event_count?': 'number.integer >= 0',
	'extrinsics_count?': 'number.integer >= 0',
	'finalized?': 'boolean',
})

export type SubscanBlockListItem = typeof subscanBlockListItemWire.infer

export const subscanBlockListWire = arktype({
	count: 'number.integer >= 0',
	blocks: subscanBlockListItemWire.array(),
})

export type SubscanBlockList = typeof subscanBlockListWire.infer

export const subscanStatusWire = arktype({
	code: 'number.integer',
	message: 'string',
	'generated_at?': 'number.integer >= 0',
	'data?': 'unknown',
})

const subscanResponseWire = <_DataWire>(
	dataWire: _DataWire
) => (
	arktype({
		code: 'number.integer',
		message: 'string',
		generated_at: 'number.integer >= 0',
		data: dataWire,
	})
)

export type SubscanResponse<_Data> = {
	code: number
	message: string
	generated_at: number
	data: _Data
}

export const subscanBlockResponseWire = subscanResponseWire(subscanBlockWire)
export const subscanExtrinsicResponseWire = subscanResponseWire(subscanExtrinsicWire)
export const subscanExtrinsicListResponseWire = subscanResponseWire(subscanExtrinsicListWire)
export const subscanReferendumResponseWire = subscanResponseWire(subscanReferendumWire)
export const subscanReferendumListResponseWire = subscanResponseWire(subscanReferendumListWire)
export const subscanBlockListResponseWire = subscanResponseWire(subscanBlockListWire)
