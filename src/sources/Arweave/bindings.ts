// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Arweave_Rest,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'arweave',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arweave.net',
				origin: 'https://arweave.net',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ar-io.net',
				origin: 'https://ar-io.net',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ArweaveGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Arweave/Rest/types.ts',
				generated: false,
			},
		],
	},
	{
		source: Source.Arweave_Graphql,
		target: {
			kind: SourceTargetKind.ContentAddressScheme,
			key: 'arweave',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arweave.net/graphql',
				origin: 'https://arweave.net',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Arweave_Rest]: typeof bindings[0]
	readonly [Source.Arweave_Graphql]: typeof bindings[1]
}>(bindings)
