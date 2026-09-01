import {
	getGithubContents,
	getGithubRawText,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/LitecoinLips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.LitecoinLips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertLipNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('LitecoinLips_Github: LIP number must be a positive safe integer')
}

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
}) => {
	assertLipNumber(number)
	return getGithubRawText({
		binding,
		target: {
			...target,
			path: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
}
