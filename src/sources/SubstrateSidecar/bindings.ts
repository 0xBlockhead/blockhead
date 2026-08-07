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
} from '$/sources/SourceBinding.ts'

const substrateSidecarRestBindingAxes = {
	source: Source.SubstrateSidecar_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: genericReadOperationGroups,
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/SubstrateSidecar/Rest/types.ts',
		},
	],
} as const

export default indexSourceBindings([
	{
		...substrateSidecarRestBindingAxes,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'polkadot',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polkadot-public-sidecar.parity-chains.parity.io',
				corsEnabled: false,
			},
		],
	},
	{
		...substrateSidecarRestBindingAxes,
		target: {
			kind: SourceTargetKind.Global,
			key: 'polkadot-asset-hub-public-sidecar',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://polkadot-asset-hub-public-sidecar.parity-chains.parity.io',
				corsEnabled: false,
			},
		],
	},
])
