export enum ExecutionProtocol {
	Ethereum = 'Ethereum',
	OpStack = 'OpStack',
	PolygonBor = 'PolygonBor',
	ArbitrumNitro = 'ArbitrumNitro',
	Other = 'Other',
}

export enum ConsensusProtocol {
	EthereumBeacon = 'EthereumBeacon',
}

/** Op Stack hardforks can include a blob-parameter-only activation alongside full execution hardforks. */
export enum NetworkExecutionUpgradeLayer {
	Execution = 'execution',
	Blob = 'blob',
}
