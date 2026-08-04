import {
	gmxApiDeployments,
} from '$/sources/Gmx/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	mapSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const gmxRestBindingAxes = {
	source: Source.Gmx_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Gmx/Rest/types.ts',
			referenceUrl: 'https://docs.gmx.io/docs/api/overview/',
		},
	],
} as const

export default indexSourceBindings(mapSourceBindings(
	gmxApiDeployments,
	(deployment) => ({
		...gmxRestBindingAxes,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: deployment.key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: deployment.apiBaseUrl,
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: deployment.peerApiBaseUrl,
				corsEnabled: true,
			},
		],
	})
))
