import {
	describe,
	expect,
	it,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/CodexNode/bindings.ts'

describe('Codex node source binding', () => {
	it('enrolls one credential-free local read boundary', () => {
		expect(bindings[Source.CodexNode_Rest]).toEqual([{
			source: Source.CodexNode_Rest,
			target: {
				kind: SourceTargetKind.LocalDevice,
				key: 'codex-node',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:8080',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.OpenApiHttp,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
			delivery: SourceDelivery.LocalOnly,
			credentials: [],
			artifacts: [
				{
					kind: SourceArtifactKind.GenerationManifest,
					path: 'src/sources/CodexNode/OpenApi/schema-source.ts',
				},
				{
					kind: SourceArtifactKind.OpenApiSpec,
					path: 'src/sources/CodexNode/OpenApi/openapi.yaml',
					generated: true,
					officialUrl: 'https://raw.githubusercontent.com/logos-storage/logos-storage-nim/master/openapi.yaml',
				},
				{
					kind: SourceArtifactKind.OpenApiTypes,
					path: 'src/sources/CodexNode/OpenApi/openapi.d.ts',
					generated: true,
				},
			],
		}])
	})
})
