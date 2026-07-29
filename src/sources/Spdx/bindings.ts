// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.SpdxDocument_Local,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'spdx-document',
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
			SourceOperationGroup.AiArtifactCatalog,
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

export default indexSourceBindings<{ readonly [Source.SpdxDocument_Local]: typeof bindings[0] }>(bindings)
