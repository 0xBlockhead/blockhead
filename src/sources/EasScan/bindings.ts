// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '10',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://optimism.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '137',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polygon.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '8453',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://base.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42170',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum-nova.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '42220',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://celo.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '59144',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://linea.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '84532',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://base-sepolia.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '534352',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://scroll.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155111',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sepolia.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '11155420',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://optimism-sepolia-bedrock.easscan.org/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/EasScan/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/EasScan/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/EasScan/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
])
