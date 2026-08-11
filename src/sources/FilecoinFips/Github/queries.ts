import {
	getGithubContents,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetText } from '$/sources/_runtime/http.ts'

const binding = bindings[Source.FilecoinFips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getMarkdownUrl = ({ number }: { number: number }) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('FilecoinFips_Github: FIP number must be a positive safe integer')

	return githubRawUrl({
		...target,
		path: `${target.path}/fip-${number.toString().padStart(4, '0')}.md`,
	})
}

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
	sourceGetText(binding, getMarkdownUrl({ number }))
)
