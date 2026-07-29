// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
	{
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Git_Local]: typeof bindings[0]
	readonly [Source.Git_Remote]: typeof bindings[1]
}>(bindings)
