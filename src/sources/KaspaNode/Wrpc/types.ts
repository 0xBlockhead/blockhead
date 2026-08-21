import type { KaspaNodeBlock, KaspaNodeBlockDagInfo, KaspaNodeServerInfo, KaspaNodeTransaction, KaspaNodeUtxo, KaspaNodeVirtualChain } from '$/sources/KaspaNode/Rest/types.ts'

export type KaspaNodeWrpcMethodResult = {
	getBlockDagInfo: KaspaNodeBlockDagInfo
	getServerInfo: KaspaNodeServerInfo
	getBalanceByAddress: { balance: string }
	getUtxosByAddresses: { entries: KaspaNodeUtxo[] } | KaspaNodeUtxo[]
	getBlock: { block: KaspaNodeBlock }
	getTransaction: { transaction: KaspaNodeTransaction }
	getVirtualChainFromBlock: KaspaNodeVirtualChain
}
