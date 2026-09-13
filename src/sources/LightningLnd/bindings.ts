// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.LightningLnd_Rest,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'lnd',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://localhost:8080',
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://localhost:8080',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		httpRequestAllowlist: [
			{
				method: 'GET',
				pathTemplate: '/v1/balance/blockchain',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/balance/channels',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/channels',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/getinfo',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/graph/edge/{channelId}',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/graph/info',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/graph/node/{publicKey}',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/invoice/{paymentHash}',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/invoices',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/payments',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/peers',
			},
			{
				method: 'GET',
				pathTemplate: '/v1/switch',
			},
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/LightningLnd/Rest/types.ts',
			},
		],
	},
])
