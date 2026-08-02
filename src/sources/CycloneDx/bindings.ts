// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.CycloneDxDocument_Local,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'cyclonedx-document',
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
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])
