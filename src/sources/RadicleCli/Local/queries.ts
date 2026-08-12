import type { RadicleCliCommand } from '$/sources/RadicleCli/Local/types.ts'

export const command = (
	args: readonly string[]
): RadicleCliCommand => ({
	command: 'rad',
	args,
})

const assertRepositoryId = (
	repositoryId: string
) => {
	if (!/^rad:z[1-9A-HJ-NP-Za-km-z]+$/.test(repositoryId))
		throw new Error('RadicleCli_Local: invalid repository ID')
}

const assertCollaborativeObjectId = (
	objectId: string
) => {
	if (!/^[0-9a-f]{40}$/.test(objectId))
		throw new Error('RadicleCli_Local: invalid collaborative object ID')
}

export const inspectRepository = (
	repositoryId: string
) => {
	assertRepositoryId(repositoryId)
	return command([
		'inspect',
		repositoryId,
	])
}

export const inspectRepositoryPayload = (
	repositoryId: string
) => {
	assertRepositoryId(repositoryId)
	return command([
		'inspect',
		'--payload',
		repositoryId,
	])
}

export const listRepositories = (
	includePrivate = false
) => command([
	'ls',
	...(includePrivate ? ['--private'] : []),
])

export const nodeStatus = () => command([
	'node',
	'status',
])

export const nodeId = () => command([
	'node',
	'status',
	'--only',
	'nid',
])

export const repositorySyncStatus = () => command([
	'sync',
	'status',
])

export const listIssues = () => command(['issue'])

export const showIssue = (
	issueId: string
) => {
	assertCollaborativeObjectId(issueId)
	return command([
		'issue',
		'show',
		issueId,
	])
}

export const listPatches = (
	includeMerged = false
) => command([
	'patch',
	...(includeMerged ? ['--merged'] : []),
])

export const showPatch = (
	patchId: string
) => {
	assertCollaborativeObjectId(patchId)
	return command([
		'patch',
		'show',
		patchId,
	])
}
