import type { JsonValue } from '$/typescript/JsonValue.ts'
export type SourcifyContractSource = {
	content?: string
	keccak256?: string
	license?: string
	[key: string]: JsonValue
}

export type SourcifyContractMetadata = {
	compiler?: {
		version?: string
		[key: string]: JsonValue
	}
	language?: string
	sources?: Record<string, SourcifyContractSource>
	fullyQualifiedName?: string
	[key: string]: JsonValue
}

export type SourcifyContractCompilation = {
	compiler?: string
	compilerVersion?: string
	language?: string
	name?: string
	fullyQualifiedName?: string
	compilerSettings?: JsonValue
	[key: string]: JsonValue
}

export type SourcifyContractDeployment = {
	deployer?: string
	transactionHash?: string
	blockNumber?: string
	transactionIndex?: string
	[key: string]: JsonValue
}

export type SourcifyProxyResolution = {
	isProxy?: boolean
	proxyType?: string
	implementations?: {
		address?: string
	}[]
	[key: string]: JsonValue
}

export type SourcifyContractLookup = {
	matchId?: string | null
	creationMatch?: string | null
	runtimeMatch?: string | null
	verifiedAt?: string
	match?: string | null
	chainId?: string
	address?: string
	abi?: JsonValue[]
	compilation?: SourcifyContractCompilation
	deployment?: SourcifyContractDeployment
	sources?: Record<string, SourcifyContractSource>
	metadata?: SourcifyContractMetadata
	storageLayout?: JsonValue
	proxyResolution?: SourcifyProxyResolution
	[key: string]: JsonValue
}
