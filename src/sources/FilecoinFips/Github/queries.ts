import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.FilecoinFips_Github]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...target,
		path: `${target.path}/fip-${number.toString().padStart(4, '0')}.md`,
	})
)

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
			path: `${target.path}/fip-${number.toString().padStart(4, '0')}.md`,
		},
	})
)
