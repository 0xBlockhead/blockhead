// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Arweave/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Arweave/Graphql/schema.graphql',
				generated: true,
				officialUrl: 'https://arweave.net/graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Arweave/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[])
