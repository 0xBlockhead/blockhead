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

const cashuMintEndpoints = [
	{
		mintUrl: 'https://8333.space:3338',
		corsEnabled: false,
	},
] as const

export const cashuBindings = cashuMintEndpoints.map((cashuMintEndpoint): SourceBinding => ({
	provider: SourceProvider.Cashu,
	source: Source.CashuMint_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: cashuMintEndpoint.mintUrl,
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: cashuMintEndpoint.mintUrl,
			origin: new URL(cashuMintEndpoint.mintUrl).origin,
			corsEnabled: cashuMintEndpoint.corsEnabled,
		},
	],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.None,
		},
	],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Cashu/Mint/Rest/types.ts',
			generated: false,
		},
	],
}))
