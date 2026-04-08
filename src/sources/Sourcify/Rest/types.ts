export type SourcifyContractSourceWire = {
	content?: string
	keccak256?: string
	license?: string
	[key: string]: unknown
}

export type SourcifyContractMetadataWire = {
	compiler?: {
		version?: string
		[key: string]: unknown
	}
	language?: string
	sources?: Record<string, SourcifyContractSourceWire>
	fullyQualifiedName?: string
	[key: string]: unknown
}

export type SourcifyContractSourceMetadata = {
	compiler?: string
	language?: string
	sources?: Record<string, unknown>
	fullyQualifiedName?: string
}

export type SourcifyContractCompilationWire = {
	compiler?: string
	compilerVersion?: string
	language?: string
	name?: string
	fullyQualifiedName?: string
	compilerSettings?: unknown
	[key: string]: unknown
}

export type SourcifyContractDeploymentWire = {
	deployer?: string
	transactionHash?: string
	blockNumber?: string
	transactionIndex?: string
	[key: string]: unknown
}

export type SourcifyContractLookupWire = {
	matchId?: string | null
	creationMatch?: string | null
	runtimeMatch?: string | null
	verifiedAt?: string
	match?: string | null
	chainId?: string
	address?: string
	abi?: unknown[]
	compilation?: SourcifyContractCompilationWire
	deployment?: SourcifyContractDeploymentWire
	sources?: Record<string, SourcifyContractSourceWire>
	metadata?: SourcifyContractMetadataWire
	[key: string]: unknown
}
