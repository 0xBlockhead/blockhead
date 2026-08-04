import type { JsonValue } from '$/typescript/JsonValue.ts'

export type SourcifyContractSource = {
	content?: string
	keccak256?: string
	license?: string
}

export type SourcifyContractMetadata = {
	compiler?: {
		version?: string
	}
	language?: string
	sources?: Record<string, SourcifyContractSource>
	fullyQualifiedName?: string
	storageLayout?: JsonValue
}

export type SourcifyContractCompilation = {
	compiler?: string
	compilerVersion?: string
	language?: string
	name?: string
	fullyQualifiedName?: string
	compilerSettings?: JsonValue
	storageLayout?: JsonValue
}

export type SourcifyContractDeployment = {
	deployer?: string
	transactionHash?: string
	blockNumber?: string
	transactionIndex?: string
}

export type SourcifyProxyResolution = {
	isProxy?: boolean
	proxyType?: string
	implementations?: {
		address?: string
	}[]
}

export type SourcifyContractMatchSummary = {
	match?: string | null
	creationMatch?: string | null
	runtimeMatch?: string | null
	matchId?: string | null
	verifiedAt?: string
	chainId?: string
	address?: string
}

export type SourcifyContractLookup = SourcifyContractMatchSummary & {
	abi?: JsonValue[]
	compilation?: SourcifyContractCompilation
	deployment?: SourcifyContractDeployment
	sources?: Record<string, SourcifyContractSource>
	metadata?: SourcifyContractMetadata
	storageLayout?: JsonValue
	proxyResolution?: SourcifyProxyResolution
}

export type SourcifyContractMatchList = {
	results: SourcifyContractMatchSummary[]
}
