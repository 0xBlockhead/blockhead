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
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.DydxIndexer,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cosmos:dydx-mainnet-1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://indexer.dydx.trade',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Dydx/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Dydx/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://raw.githubusercontent.com/dydxprotocol/v4-chain/main/indexer/services/comlink/public/swagger.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Dydx/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.DydxIndexer,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cosmos:dydx-mainnet-1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://indexer.dydx.trade/v4/ws',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.DydxIndexer,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Dydx/WebSocket/types.ts',
				referenceUrl: 'https://raw.githubusercontent.com/dydxprotocol/v4-chain/main/indexer/packages/postgres/src/types/websocket-message-types.ts',
			},
		],
	},
])
