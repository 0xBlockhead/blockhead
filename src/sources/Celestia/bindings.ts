// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default indexSourceBindings([
	{
		source: Source.CelestiaNode,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'celestia',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:PUBLIC_CELESTIA_NODE_RPC_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.CelestiaNodeJsonRpc,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_CELESTIA_NODE_RPC_URL': 'string.url',
				}),
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Celestia/JsonRpc/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Celestia/JsonRpc/types.ts',
			},
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/Celestia/JsonRpc/openrpc.json',
				generated: true,
				officialUrl: 'https://docs.celestia.org/specs/openrpc-v0.28.4.json',
			},
			{
				kind: SourceArtifactKind.OpenRpcTypes,
				path: 'src/sources/Celestia/JsonRpc/openrpc.d.ts',
				generated: true,
			},
		],
	},
])
