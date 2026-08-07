import { type as arktype } from 'arktype'


const mintscanAccountBaseWire = arktype({
	'address?': 'string',
	'account_number?': 'string',
	'sequence?': 'string',
})

export const mintscanAccountWire = arktype({
	"'@type'?": 'string',
	'address?': 'string',
	'account_number?': 'string',
	'sequence?': 'string',
	'base_account?': mintscanAccountBaseWire,
	'base_vesting_account?': {
		'base_account?': mintscanAccountBaseWire,
	},
})

export type MintscanAccount = typeof mintscanAccountWire.infer

export const mintscanAccountResponseWire = arktype({
	account: mintscanAccountWire,
})

export type MintscanAccountResponse = typeof mintscanAccountResponseWire.infer

export const mintscanBlockResponseWire = arktype({
	block_id: {
		hash: 'string > 0',
	},
	block: {
		header: {
			height: 'string > 0',
			time: 'string > 0',
			proposer_address: 'string > 0',
		},
		data: {
			'txs?': arktype('string').array(),
		},
	},
})

export type MintscanBlockResponse = typeof mintscanBlockResponseWire.infer

export const mintscanNodeInfoResponseWire = arktype({
	default_node_info: {
		network: 'string > 0',
		'version?': 'string',
		'moniker?': 'string',
	},
	'application_version?': {
		'name?': 'string',
		'app_name?': 'string',
		'version?': 'string',
		'cosmos_sdk_version?': 'string',
	},
})

export type MintscanNodeInfoResponse = typeof mintscanNodeInfoResponseWire.infer

export const mintscanSyncingResponseWire = arktype({
	syncing: 'boolean',
})

export type MintscanSyncingResponse = typeof mintscanSyncingResponseWire.infer

const mintscanTxMessageWire = arktype({
	"'@type'?": 'string',
	'signer?': 'string',
	'sender?': 'string',
	'from_address?': 'string',
	'contract?': 'string',
})

const mintscanTxWire = arktype({
	'body?': {
		'memo?': 'string',
		'timeout_height?': 'string',
		'messages?': mintscanTxMessageWire.array(),
	},
	'auth_info?': {
		'fee?': {
			'amount?': arktype({
				denom: 'string > 0',
				amount: 'string > 0',
			}).array(),
			'gas_limit?': 'string',
		},
	},
	'signatures?': arktype('string').array(),
})

export const mintscanTxResponseWire = arktype({
	'tx?': mintscanTxWire,
	tx_response: {
		height: 'string > 0',
		txhash: 'string > 0',
		code: 'number.integer >= 0',
		'codespace?': 'string',
		gas_wanted: 'string',
		gas_used: 'string',
		raw_log: 'string',
		'timestamp?': 'string',
		'events?': arktype({
			type: 'string > 0',
		}).array(),
	},
})

export type MintscanTxResponse = typeof mintscanTxResponseWire.infer
