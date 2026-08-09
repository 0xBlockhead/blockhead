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

const gitRepositoryContentsRepositoryMetadataOperationGroups = [
	SourceOperationGroup.GitRepositoryContents,
	SourceOperationGroup.RepositoryMetadata,
] as const

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
		operationGroups: gitRepositoryContentsRepositoryMetadataOperationGroups,
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
		operationGroups: gitRepositoryContentsRepositoryMetadataOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
])
