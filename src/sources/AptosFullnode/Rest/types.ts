import type { components } from '$/sources/AptosFullnode/OpenApi/openapi.d.ts'

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

export type AptosResponse<_Body> = {
	body: _Body
	metadata: AptosResponseMetadata
}
