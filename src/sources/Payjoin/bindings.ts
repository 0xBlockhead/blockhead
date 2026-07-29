// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.PayjoinOhttpRelay_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'ohttp-relay',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{payjoin-ohttp-relay-host}',
				origin: 'https://{payjoin-ohttp-relay-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.PayjoinReceiver_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'receiver',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{payjoin-receiver-host}',
				origin: 'https://{payjoin-receiver-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.PayjoinDirectory_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'directory',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://payjo.in',
				origin: 'https://payjo.in',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:8080',
				origin: 'http://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://localhost:8080',
				origin: 'http://localhost:8080',
				corsEnabled: false,
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
				path: 'src/sources/Payjoin/Directory/Rest/queries.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.PayjoinOhttpRelay_Http]: typeof bindings[0]
	readonly [Source.PayjoinReceiver_Http]: typeof bindings[1]
	readonly [Source.PayjoinDirectory_Rest]: typeof bindings[2]
}>(bindings)
