import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/LitecoinLips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.LitecoinLips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getMediaWikiText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
