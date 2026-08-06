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
