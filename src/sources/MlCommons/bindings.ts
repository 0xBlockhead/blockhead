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

export const mlCommonsBindings = [
	{
		provider: SourceProvider.MlCommons,
		source: Source.CroissantDocument_Local,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'croissant-document',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalFilePath,
				locator: 'selected-file-or-artifact',
			},
		],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.AiDatasetMetadata,
			SourceOperationGroup.DocumentClaimExtraction,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]
