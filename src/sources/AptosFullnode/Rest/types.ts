import type { components } from '$/sources/AptosFullnode/OpenApi/openapi.d.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'

export type AptosLedgerInfo = components['schemas']['IndexResponse']
export type AptosAccount = components['schemas']['AccountData']
export type AptosMoveResource = components['schemas']['MoveResource']
export type AptosMoveModule = components['schemas']['MoveModuleBytecode']
export type AptosEvent = components['schemas']['Event']
export type AptosWriteSetChange = components['schemas']['WriteSetChange']
export type AptosTransaction = components['schemas']['Transaction']
export type AptosBlock = components['schemas']['Block']
export type AptosTableItemRequest = components['schemas']['TableItemRequest']

export type AptosResponseMetadata = {
	chainId: string
	ledgerVersion: string
	oldestLedgerVersion: string
	ledgerTimestampUsec: string
	epoch: string
	blockHeight: string
	oldestBlockHeight: string
	gasUsed?: string
	cursor?: string
}

const aptosU64String = arktype('string').narrow((value, ctx) => {
	try {
		return BigInt(value) >= 0n || ctx.mustBe('a nonnegative integer string')
	} catch {
		return ctx.mustBe('a nonnegative integer string')
	}
})

export const aptosLedgerInfoWire = arktype({
	chain_id: 'number.integer',
	epoch: aptosU64String,
	ledger_version: aptosU64String,
	oldest_ledger_version: aptosU64String,
	ledger_timestamp: aptosU64String,
	node_role: 'string',
	oldest_block_height: aptosU64String,
	block_height: aptosU64String,
	'git_hash?': 'string',
	'encryption_key?': 'string',
})

export const aptosAccountWire = arktype({
	sequence_number: aptosU64String,
	authentication_key: 'string',
}) satisfies Type<{
	sequence_number: string
	authentication_key: string
}>

export const aptosMoveResourceWire = arktype({
	type: 'string',
	data: 'unknown',
})

export const aptosEventWire = arktype({
	guid: {
		creation_number: aptosU64String,
		account_address: 'string',
	},
	sequence_number: aptosU64String,
	type: 'string',
	data: 'unknown',
})

export const aptosBlockWire = arktype({
	block_height: aptosU64String,
	block_hash: 'string',
	block_timestamp: aptosU64String,
	first_version: aptosU64String,
	last_version: aptosU64String,
	'transactions?': 'unknown[]',
})

export const aptosTransactionWire = arktype({
	type: 'string',
	hash: 'string',
	'version?': aptosU64String,
	'changes?': 'unknown[]',
	'events?': 'unknown[]',
	'sender?': 'string',
	'timestamp?': aptosU64String,
	'gas_used?': aptosU64String,
	'success?': 'boolean',
	'vm_status?': 'string',
}).and(arktype('Record<string, unknown>'))

const aptosHexEncodedBytes = arktype('string').narrow((value, ctx) => (
	/^0x[0-9a-fA-F]*$/.test(value) || ctx.mustBe('a 0x-prefixed hex string')
))

const aptosMoveFunctionWire = arktype({
	name: 'string',
	visibility: "'private' | 'public' | 'friend'",
	is_entry: 'boolean',
	is_view: 'boolean',
	generic_type_params: arktype({
		constraints: 'string[]',
	}).array(),
	params: 'string[]',
	return: 'string[]',
})

const aptosMoveStructFieldWire = arktype({
	name: 'string',
	type: 'string',
})

const aptosMoveStructWire = arktype({
	name: 'string',
	is_native: 'boolean',
	is_event: 'boolean',
	is_enum: 'boolean',
	abilities: 'string[]',
	generic_type_params: arktype({
		constraints: 'string[]',
	}).array(),
	fields: aptosMoveStructFieldWire.array(),
	'variants?': 'unknown[]',
})

export const aptosMoveModuleAbiWire = arktype({
	address: 'string',
	name: 'string',
	friends: 'string[]',
	exposed_functions: aptosMoveFunctionWire.array(),
	structs: aptosMoveStructWire.array(),
})

export const aptosMoveModuleBytecodeWire = arktype({
	bytecode: aptosHexEncodedBytes,
	'abi?': aptosMoveModuleAbiWire,
})

const aptosDeletedTableDataWire = arktype({
	key: 'unknown',
	key_type: 'string',
})

const aptosDecodedTableDataWire = arktype({
	key: 'unknown',
	key_type: 'string',
	value: 'unknown',
	value_type: 'string',
})

export const aptosWriteSetChangeWire = arktype({
	type: "'delete_module'",
	address: 'string',
	state_key_hash: 'string',
	module: 'string',
}).or({
	type: "'delete_resource'",
	address: 'string',
	state_key_hash: 'string',
	resource: 'string',
}).or({
	type: "'delete_table_item'",
	state_key_hash: 'string',
	handle: 'string',
	key: 'string',
	'data?': aptosDeletedTableDataWire,
}).or({
	type: "'write_module'",
	address: 'string',
	state_key_hash: 'string',
	data: {
		bytecode: 'string',
		'abi?': aptosMoveModuleAbiWire,
	},
}).or({
	type: "'write_resource'",
	address: 'string',
	state_key_hash: 'string',
	data: aptosMoveResourceWire,
}).or({
	type: "'write_table_item'",
	state_key_hash: 'string',
	handle: 'string',
	key: 'string',
	value: 'string',
	'data?': aptosDecodedTableDataWire,
})

export const aptosTableItemRequestWire = arktype({
	key_type: 'string',
	value_type: 'string',
	key: 'unknown',
})

/** Fullnode `/tables/{handle}/item` returns the Move value itself (JSON), not a wrapper object. */
export const aptosTableItemValueWire = arktype(
	'string | number | boolean | null | unknown[] | Record<string, unknown>'
)

export { aptosDecodedTableDataWire }
