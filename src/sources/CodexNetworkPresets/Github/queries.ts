import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

const target = {
	owner: 'codex-storage-network',
	repo: 'codex-network-presets',
	ref: 'master',
	path: '',
}

export const getContents = (
	binding: SourceBinding
) => (
	getGithubContents({
		binding,
		target,
	})
)

export const getRawText = (
	binding: SourceBinding,
	path: string
) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path,
		},
	})
)
