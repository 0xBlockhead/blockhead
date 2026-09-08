import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.AtprotoSync_Xrpc,
		target: {
			kind: SourceTargetKind.Global,
			key: 'atproto-plc-directory',
		},
		endpoints: [{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://plc.directory',
			corsEnabled: false,
		}],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
		source: Source.AtprotoSync_Xrpc,
		target: {
			kind: SourceTargetKind.Global,
			key: 'atproto-did-web',
		},
		endpoints: [{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://{did-web-host}',
			corsEnabled: false,
		}],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
		source: Source.AtprotoSync_Xrpc,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'atproto-sync',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{pds-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Xrpc,
		apiFamily: ApiFamily.AtprotoSync,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
		source: Source.AtprotoSync_Xrpc,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'atproto-sync',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://{pds-host}/xrpc/com.atproto.sync.subscribeRepos',
			},
		],
		wireProtocol: WireProtocol.Xrpc,
		apiFamily: ApiFamily.AtprotoSync,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
	},
])
