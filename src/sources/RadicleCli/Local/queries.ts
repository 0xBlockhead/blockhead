import type { RadicleCliCommand } from '$/sources/RadicleCli/Local/types.ts'

export const command = (
	args: readonly string[]
): RadicleCliCommand => ({
	command: 'rad',
	args,
})

export const inspectRepository = (
	repositoryId: string
) => (
	command([
		'inspect',
		repositoryId,
	])
)
