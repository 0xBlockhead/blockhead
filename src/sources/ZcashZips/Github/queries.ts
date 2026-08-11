import {
	getGithubContents,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceGetText } from '$/sources/_runtime/http.ts'

const binding = bindings[Source.ZcashZips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertZipNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('ZcashZips_Github: ZIP number must be a positive safe integer')
}

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getProposalRstUrl = ({ number }: { number: number }) => {
	assertZipNumber(number)
	return githubRawUrl({
		...target,
		path: `${target.path}/zip-${number.toString().padStart(4, '0')}.rst`,
	})
}

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProposalRstText = ({
	number,
}: {
	number: number
}) => (
	sourceGetText(binding, getProposalRstUrl({ number }))
)
