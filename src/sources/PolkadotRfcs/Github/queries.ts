import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.PolkadotRfcs_Github]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getMarkdownText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path: `${target.path}/${number.toString().padStart(4, '0')}.md`,
		},
	})
)
