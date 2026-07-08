import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { beaconchaInApiBaseByExecutionChainId } from '$/sources/BeaconchaIn/Rest/constants.ts'

export const beaconchaInPublicEnv = arktype({
	PUBLIC_BEACONCHAIN_API_KEY: 'string > 0',
})

const beaconchaInCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		env: beaconchaInPublicEnv,
		keys: [
			'PUBLIC_BEACONCHAIN_API_KEY',
		],
	},
] as const

export const beaconchaInBindings = Object.entries(beaconchaInApiBaseByExecutionChainId)
	.map(([chainId, apiBase]): SourceBinding => ({
		provider: SourceProvider.BeaconchaIn,
		source: Source.BeaconchaIn_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: String(chainId),
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: apiBase,
				origin: new URL(apiBase).origin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: beaconchaInCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/BeaconchaIn/Rest/types.ts',
				generated: false,
			},
		],
	}))
