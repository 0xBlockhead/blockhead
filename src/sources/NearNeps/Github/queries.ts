import bindings from '$/sources/NearNeps/bindings.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NearNeps_Github][0]
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
}) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('NearNeps_Github: NEP number must be a positive safe integer')

	return getGithubRawText({
		binding,
		target: {
			...target,
			path: `${target.path}/nep-${number.toString().padStart(4, '0')}.md`,
		},
	})
}
