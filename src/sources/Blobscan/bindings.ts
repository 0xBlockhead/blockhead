// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const blobscanRestBindingAxes = {
	source: Source.Blobscan_Rest,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Blobscan/Rest/types.ts',
		},
	],
} as const

const blobscanRestTargets = [
	{
		key: '1',
		locator: 'https://api.blobscan.com',
	},
	{
		key: '11155111',
		locator: 'https://api.sepolia.blobscan.com',
	},
	{
		key: '100',
		locator: 'https://api.gnosis.blobscan.com',
	},
	{
		key: '560048',
		locator: 'https://api.hoodi.blobscan.com',
	},
] as const

export default indexSourceBindings(blobscanRestTargets.map(({
	key,
	locator,
}) => ({
		...blobscanRestBindingAxes,
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
