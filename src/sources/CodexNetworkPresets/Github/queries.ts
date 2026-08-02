import bindings from '$/sources/CodexNetworkPresets/bindings.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CodexNetworkPresets_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getRawText = (
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
