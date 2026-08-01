// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://ar-io.net',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ArweaveGateway,
		operationGroups: [
			SourceOperationGroup.ContentGatewayRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Arweave/Rest/types.ts',
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
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Arweave/Graphql/schema.graphql',
				generated: true,
				officialUrl: 'https://arweave.net/graphql',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Arweave/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Arweave/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
