// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const easScanGraphqlBindingAxes = {
	source: Source.EasScan_Graphql,
	wireProtocol: WireProtocol.Graphql,
	apiFamily: ApiFamily.GraphqlHttp,
	operationGroups: genericReadOperationGroups,
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
} as const

const easScanGraphqlTargets = [
	{
		key: '1',
		locator: 'https://easscan.org/graphql',
	},
	{
		key: '10',
		locator: 'https://optimism.easscan.org/graphql',
	},
	{
		key: '137',
		locator: 'https://polygon.easscan.org/graphql',
	},
	{
		key: '8453',
		locator: 'https://base.easscan.org/graphql',
	},
	{
		key: '42161',
		locator: 'https://arbitrum.easscan.org/graphql',
	},
	{
		key: '42170',
		locator: 'https://arbitrum-nova.easscan.org/graphql',
	},
	{
		key: '42220',
		locator: 'https://celo.easscan.org/graphql',
	},
	{
		key: '59144',
		locator: 'https://linea.easscan.org/graphql',
	},
	{
		key: '84532',
		locator: 'https://base-sepolia.easscan.org/graphql',
	},
	{
		key: '534352',
		locator: 'https://scroll.easscan.org/graphql',
	},
	{
		key: '11155111',
		locator: 'https://sepolia.easscan.org/graphql',
	},
	{
		key: '11155420',
		locator: 'https://optimism-sepolia-bedrock.easscan.org/graphql',
	},
] as const

export default indexSourceBindings(easScanGraphqlTargets.map(({
	key,
	locator,
}) => ({
		...easScanGraphqlBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
} satisfies SourceBinding)))
