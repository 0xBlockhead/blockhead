export type RadicleCliCommand = {
	command: 'rad'
	args: readonly string[]
}

export type RadicleRepositoryRead = {
	rid: string
	name?: string
	description?: string
	visibility: 'public' | 'private'
	defaultBranch?: string
	git: { repositoryId: string; objectFormat: 'sha1' | 'sha256' }
}

export type RadicleCliPlatformAdapter = {
	read: (command: RadicleCliCommand) => Promise<string>
}

export type RadicleCliSession = {
	readRepository: (repositoryId: string) => Promise<RadicleRepositoryRead>
}
