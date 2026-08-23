export type GitLocalRefRead = {
	refName: string
	refKind: string
	targetObjectId: string
}

export type GitLocalRepositoryRead = {
	repositoryId: string
	objectFormat: 'sha1' | 'sha256'
	defaultRefName?: string
	refs: readonly GitLocalRefRead[]
}

export type GitLocalPlatformAdapter = {
	readRepository: (repositoryId: string) => Promise<string>
}

export type GitLocalSession = {
	readRepository: (repositoryId: string) => Promise<GitLocalRepositoryRead>
}
