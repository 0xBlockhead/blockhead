import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { blockchairOrigin } from '$/sources/Blockchair/Rest/constants.ts'

export const blockchairBindings = [
	{
		provider: SourceProvider.Blockchair,
		source: Source.Blockchair_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'blockchair',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: blockchairOrigin,
				origin: blockchairOrigin,
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
				scope: SourceCredentialScope.PublicConfig,
				keys: [
					'PUBLIC_BLOCKCHAIR_API_KEY',
				],
			},
		],
	},
] as const satisfies readonly SourceBinding[]
