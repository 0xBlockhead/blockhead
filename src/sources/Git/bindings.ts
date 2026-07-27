// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Git_Local]: {
		source: Source.Git_Local,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'local-git-repository',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalFilePath,
				locator: '{repository-path}',
			},
		],
		wireProtocol: WireProtocol.Git,
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
	[Source.Git_Remote]: {
		source: Source.Git_Remote,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'remote-git-repository',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{host}/{owner}/{repo}.git',
				origin: 'https://{host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Git,
		apiFamily: ApiFamily.GitObject,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
} as const satisfies SourceBindingIndex
