/**
 * Sourcify Server API v2 wire envelopes (fail-closed arktype).
 * @see https://docs.sourcify.dev/docs/api/
 */
import { type as arktype } from 'arktype'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const nullableString = arktype('string > 0').or(arktype('null'))
const jsonUnknown = arktype('unknown')

export const sourcifyContractSourceEnvelope = arktype({
	'content?': 'string',
	'keccak256?': 'string',
	'license?': 'string',
})

export type SourcifyContractSource = typeof sourcifyContractSourceEnvelope.infer

export const sourcifyContractMetadataEnvelope = arktype({
	'compiler?': {
		'version?': 'string',
	},
	'language?': 'string',
	'sources?': arktype({
		'[string]': sourcifyContractSourceEnvelope,
	}),
	'fullyQualifiedName?': 'string',
	'storageLayout?': jsonUnknown,
})

export type SourcifyContractMetadata = typeof sourcifyContractMetadataEnvelope.infer

export const sourcifyContractCompilationEnvelope = arktype({
	'compiler?': 'string',
	'compilerVersion?': 'string',
	'language?': 'string',
	'name?': 'string',
	'fullyQualifiedName?': 'string',
	'compilerSettings?': jsonUnknown,
	'storageLayout?': jsonUnknown,
})

export type SourcifyContractCompilation = typeof sourcifyContractCompilationEnvelope.infer

export const sourcifyContractDeploymentEnvelope = arktype({
	'deployer?': 'string',
	'transactionHash?': 'string',
	'blockNumber?': 'string',
	'transactionIndex?': 'string',
})

export type SourcifyContractDeployment = typeof sourcifyContractDeploymentEnvelope.infer

export const sourcifyProxyResolutionEnvelope = arktype({
	'isProxy?': 'boolean',
	'proxyType?': 'string',
	'implementations?': arktype({
		'address?': 'string',
	}).array(),
})

export type SourcifyProxyResolution = typeof sourcifyProxyResolutionEnvelope.infer

export const sourcifyContractMatchSummaryEnvelope = arktype({
	'match?': nullableString,
	'creationMatch?': nullableString,
	'runtimeMatch?': nullableString,
	'matchId?': nullableString,
	'verifiedAt?': 'string',
	'chainId?': 'string',
	'address?': 'string',
})

export type SourcifyContractMatchSummary = typeof sourcifyContractMatchSummaryEnvelope.infer

export const sourcifyContractLookupEnvelope = arktype({
	'match?': nullableString,
	'creationMatch?': nullableString,
	'runtimeMatch?': nullableString,
	'matchId?': nullableString,
	'verifiedAt?': 'string',
	'chainId?': 'string',
	'address?': 'string',
	'abi?': jsonUnknown.array(),
	'compilation?': sourcifyContractCompilationEnvelope,
	'deployment?': sourcifyContractDeploymentEnvelope,
	'sources?': arktype({
		'[string]': sourcifyContractSourceEnvelope,
	}),
	'metadata?': sourcifyContractMetadataEnvelope,
	'storageLayout?': jsonUnknown,
	'proxyResolution?': sourcifyProxyResolutionEnvelope,
})

export type SourcifyContractLookup = Omit<
	typeof sourcifyContractLookupEnvelope.infer,
	'abi' | 'sources' | 'storageLayout'
> & {
	abi?: JsonValue[]
	sources?: Record<string, SourcifyContractSource>
	storageLayout?: JsonValue
}

export const sourcifyContractMatchListEnvelope = arktype({
	results: sourcifyContractMatchSummaryEnvelope.array(),
})

export type SourcifyContractMatchList = typeof sourcifyContractMatchListEnvelope.infer
