import { type as arktype } from 'arktype'


export const zeroGStorageNodeEvmAddressWire = arktype('/^0x[0-9a-fA-F]{40}$/')

export const zeroGStorageNodeNetworkProtocolVersionWire = arktype({
	major: 'number.integer >= 0',
	minor: 'number.integer >= 0',
	build: 'number.integer >= 0',
})

export type ZeroGStorageNodeNetworkProtocolVersion = typeof zeroGStorageNodeNetworkProtocolVersionWire.infer

export const zeroGStorageNodeNetworkIdentityWire = arktype({
	chainId: 'number.integer > 0',
	flowAddress: zeroGStorageNodeEvmAddressWire,
	p2pProtocolVersion: zeroGStorageNodeNetworkProtocolVersionWire,
})

export type ZeroGStorageNodeNetworkIdentity = typeof zeroGStorageNodeNetworkIdentityWire.infer

export const zeroGStorageNodeStatusWire = arktype({
	connectedPeers: 'number.integer >= 0',
	logSyncHeight: 'number.integer >= 0',
	logSyncBlock: 'string > 0',
	nextTxSeq: 'number.integer >= 0',
	networkIdentity: zeroGStorageNodeNetworkIdentityWire,
})

export type ZeroGStorageNodeStatus = typeof zeroGStorageNodeStatusWire.infer

export const zeroGStorageNodeTransactionWire = arktype({
	streamIds: arktype('string > 0').array(),
	data: 'string',
	dataMerkleRoot: 'string > 0',
	startEntryIndex: 'number.integer >= 0',
	size: 'number.integer >= 0',
	seq: 'number.integer >= 0',
})

export type ZeroGStorageNodeTransaction = typeof zeroGStorageNodeTransactionWire.infer

export const zeroGStorageNodeFileInfoWire = arktype({
	tx: zeroGStorageNodeTransactionWire,
	finalized: 'boolean',
	isCached: 'boolean',
	uploadedSegNum: 'number.integer >= 0',
	pruned: 'boolean',
})

export type ZeroGStorageNodeFileInfo = typeof zeroGStorageNodeFileInfoWire.infer

export const zeroGStorageNodeFileInfoOrNullWire = zeroGStorageNodeFileInfoWire.or(arktype('null'))

export const zeroGStorageNodeFlowProofWire = arktype({
	lemma: arktype('string > 0').array(),
	path: arktype('boolean').array(),
})

export type ZeroGStorageNodeFlowProof = typeof zeroGStorageNodeFlowProofWire.infer
