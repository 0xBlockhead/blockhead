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

export const inspectRepository = (
	repositoryId: string
) => {
	assertRepositoryId(repositoryId)
	return command([
		'inspect',
		repositoryId,
	])
}
