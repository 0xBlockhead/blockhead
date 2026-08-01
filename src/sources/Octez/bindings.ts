// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.OctezNode,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'tezos:NetXdQprcVkpaWU',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://tezos-mainnet.octez.io',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.TezosNodeRpc,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Octez/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://gitlab.com/tezos/tezos/-/raw/master/docs/api/rpc-openapi.json',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Octez/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Octez/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
