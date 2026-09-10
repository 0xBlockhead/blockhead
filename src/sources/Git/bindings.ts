// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
])
