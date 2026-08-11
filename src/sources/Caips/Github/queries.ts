import {
	caipOfficialHumanBaseUrl,
} from '$/sources/Caips/Github/constants.ts'
import bindings from '$/sources/Caips/bindings.ts'
import {
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	getGithubContents,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

const binding = bindings[Source.Caips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

const assertCaipNumber = (number: number) => {
	if (!Number.isSafeInteger(number) || number < 1)
		throw new Error('Caips_Github: CAIP number must be a positive safe integer')
}

export const getContentsUrl = () => githubContentsUrl(target)

export const getRawMarkdownUrl = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => (
	downloadUrl ??
	githubRawUrl({
		...target,
		path: `${target.path}/${fileName}`,
	})
)

export const getMarkdownUrlForNumber = ({ number }: { number: number }) => {
	assertCaipNumber(number)
	return githubRawUrl({
		...target,
		path: `${target.path}/caip-${number}.md`,
	})
}

export const getHumanDocUrl = ({ number }: { number: number }) => {
	assertCaipNumber(number)
	return `${caipOfficialHumanBaseUrl}${number}`
}

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getRawMarkdownText = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => (
	downloadUrl == null ?
		sourceGetText(binding, getRawMarkdownUrl({
			fileName,
			downloadUrl,
		}))
	:
		sourceGetText(binding, downloadUrl)
)

export const getMarkdownTextForNumber = ({
	number,
}: {
	number: number
}) => (
	sourceGetText(binding, getMarkdownUrlForNumber({ number }))
)
