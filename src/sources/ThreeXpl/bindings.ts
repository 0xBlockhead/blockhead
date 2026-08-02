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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const threeXplRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

export default indexSourceBindings([
	{
		source: Source.ThreeXpl_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'sandbox',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://sandbox-api.3xpl.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: threeXplRestGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ThreeXpl/Rest/types.ts',
			},
		],
	},
	{
		source: Source.ThreeXpl_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'production',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.3xpl.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: threeXplRestGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
				keys: [
					'Xpl-Token',
				],
			},
		],
	},
] as const satisfies readonly SourceBinding[])
