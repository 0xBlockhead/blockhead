import { type as arktype } from 'arktype'

export const eip8004ScanServiceWire = arktype({
	'endpoint?': 'string',
	'name?': 'string',
	'version?': 'string',
	'protocol?': 'string',
	'active?': 'boolean',
})

export type Eip8004ScanService = typeof eip8004ScanServiceWire.infer

export const eip8004ScanAgentListItemWire = arktype({
	token_id: 'string',
	chain_id: 'number.integer > 0',
	contract_address: 'string',
	'agent_id?': 'string | null',
	'agent_wallet?': 'string | null',
	'owner_address?': 'string | null',
	'name?': 'string | null',
	'description?': 'string | null',
	'image_url?': 'string | null',
	'x402_supported?': 'boolean',
	'is_active?': 'boolean',
	'supported_trust_models?': 'string[]',
	'created_block_number?': 'number.integer >= 0 | null',
	'created_tx_hash?': 'string | null',
	'updated_at?': 'string | null',
	'created_at?': 'string | null',
	'is_endpoint_verified?': 'boolean',
	'endpoint_verification_error?': 'string | null',
	'a2a_endpoint?': 'string | null',
	'agent_url?': 'string | null',
})

export type Eip8004ScanAgentListItem = typeof eip8004ScanAgentListItemWire.infer

export const eip8004ScanAgentsListResponseWire = arktype({
	'success?': 'boolean',
	data: eip8004ScanAgentListItemWire.array(),
	meta: {
		pagination: {
			'total': 'number.integer >= 0',
			'page?': 'number.integer > 0',
			'limit?': 'number.integer > 0',
			'hasMore?': 'boolean',
		},
	},
})

export type Eip8004ScanAgentsListResponse = typeof eip8004ScanAgentsListResponseWire.infer

export const eip8004ScanAgentDetailWire = eip8004ScanAgentListItemWire.and(arktype({
	'raw_metadata?': {
		'offchain_uri?': 'string',
		'offchain_content?': {
			'type?': 'string',
			'supportedTrust?': 'string[]',
			'active?': 'boolean',
		},
	},
	'services?': arktype('Record<string, unknown>').or(arktype.null),
}))

export type Eip8004ScanAgentDetail = typeof eip8004ScanAgentDetailWire.infer

export const eip8004ScanAgentDetailResponseWire = arktype({
	'success?': 'boolean',
	data: eip8004ScanAgentDetailWire,
})

export type Eip8004ScanAgentDetailResponse = typeof eip8004ScanAgentDetailResponseWire.infer
