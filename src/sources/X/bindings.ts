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

export default indexSourceBindings([
	{
		source: Source.X_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'api-v2',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.x.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: [
					'X_API_BEARER',
				],
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/X/Rest/types.ts',
			},
		],
	},
])
