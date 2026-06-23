import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceEndpoint,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const payjoinDirectoryEndpoints = [
	'https://payjo.in',
	'http://127.0.0.1:8080',
	'http://localhost:8080',
] as const

export const payjoinBindings = [
	{
		provider: SourceProvider.Payjoin,
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
		provider: SourceProvider.Payjoin,
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
		provider: SourceProvider.Payjoin,
		source: Source.PayjoinDirectory_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'directory',
		},
		endpoints: payjoinDirectoryEndpoints.map((directoryUrl): SourceEndpoint => ({
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: directoryUrl,
			origin: new URL(directoryUrl).origin,
			corsEnabled: false,
		})),
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
] satisfies readonly SourceBinding[]
