import bindings from '$/sources/DogecoinDips/bindings.ts'
import {
	getGithubContents,
	githubRepositoryTargetFromKey,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.DogecoinDips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertDipNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('DogecoinDips_Github: DIP number must be a positive safe integer')
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
	assertDipNumber(number)
	return sourceGetText(binding, githubRawUrl({
		...target,
		path: [
			target.path,
			`dip-${number.toString().padStart(4, '0')}.mediawiki`,
		].filter(Boolean).join('/'),
	}))
}
