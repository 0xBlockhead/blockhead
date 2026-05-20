import type { JsonValue } from '$/typescript/JsonValue.ts'
export type SourcifyContractSourceWire = {
	content?: string
	keccak256?: string
	license?: string
	[key: string]: JsonValue
}

export type SourcifyContractMetadataWire = {
	compiler?: {
		version?: string
		[key: string]: JsonValue
	}
	language?: string
	sources?: Record<string, SourcifyContractSourceWire>
	fullyQualifiedName?: string
	[key: string]: JsonValue
}

export type SourcifyContractCompilationWire = {
	compiler?: string
	compilerVersion?: string
	language?: string
	name?: string
	fullyQualifiedName?: string
	compilerSettings?: JsonValue
	[key: string]: JsonValue
}

export type SourcifyContractDeploymentWire = {
	deployer?: string
	transactionHash?: string
	blockNumber?: string
	transactionIndex?: string
	[key: string]: JsonValue
}

export type SourcifyProxyResolutionWire = {
	isProxy?: boolean
	proxyType?: string
	implementations?: {
		address?: string
	}[]
	[key: string]: JsonValue
}

export type SourcifyContractLookupWire = {
	matchId?: string | null
	creationMatch?: string | null
	runtimeMatch?: string | null
	verifiedAt?: string
	match?: string | null
	chainId?: string
	address?: string
	abi?: JsonValue[]
	compilation?: SourcifyContractCompilationWire
	deployment?: SourcifyContractDeploymentWire
	sources?: Record<string, SourcifyContractSourceWire>
	metadata?: SourcifyContractMetadataWire
	storageLayout?: JsonValue
	proxyResolution?: SourcifyProxyResolutionWire
	[key: string]: JsonValue
}
