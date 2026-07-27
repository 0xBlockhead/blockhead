// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Radicle_Local]: {
		source: Source.Radicle_Local,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'radicle-repository',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalFilePath,
				locator: 'env:RADICLE_STORAGE_PATH',
			},
		],
		wireProtocol: WireProtocol.LocalFile,
		apiFamily: ApiFamily.GitObject,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
	[Source.Radicle_Remote]: {
		source: Source.Radicle_Remote,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'radicle-repository',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:RADICLE_REMOTE_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
} as const satisfies SourceBindingIndex
