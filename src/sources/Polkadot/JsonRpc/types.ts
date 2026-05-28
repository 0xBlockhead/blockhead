export type PolkadotRpcBlock = {
	block: {
		header: PolkadotRpcHeader
		extrinsics: string[]
	}
}

export type PolkadotRpcHeader = {
	parentHash: string
	number: string
	stateRoot: string
	extrinsicsRoot: string
}
