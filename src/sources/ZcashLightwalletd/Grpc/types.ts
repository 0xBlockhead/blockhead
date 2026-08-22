export type ZcashLightwalletdGrpcUnaryCall = <Request, Response>(call: {
	service: 'cash.z.wallet.sdk.rpc.CompactTxStreamer'
	method: string
	request: Request
}) => Promise<Response>

export type ZcashLightwalletdBlockId = {
	height: bigint
}

export type ZcashLightwalletdCompactTransaction = {
	index: number
	txid: Uint8Array
	spends: { nf: Uint8Array }[]
	outputs: { cmu: Uint8Array }[]
	actions: { nullifier: Uint8Array; cmx: Uint8Array }[]
}

export type ZcashLightwalletdCompactBlock = {
	height: bigint
	hash: Uint8Array
	prevHash: Uint8Array
	time: number
	vtx: ZcashLightwalletdCompactTransaction[]
}

export type ZcashLightwalletdBlockIdResponse = {
	height: bigint
	hash: Uint8Array
}

export type ZcashLightwalletdTreeState = {
	height: bigint
	hash: string
	time: number
	saplingTree: string
	orchardTree: string
}

export type ZcashLightwalletdInfo = {
	version: string
	chainName: string
	blockHeight: bigint
	estimatedHeight: bigint
}
