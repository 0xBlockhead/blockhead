import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/CosmosAdrs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CosmosAdrs_Github][0]
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
			path: `${target.path}/adr-${number.toString().padStart(3, '0')}.md`,
		},
	})
)
