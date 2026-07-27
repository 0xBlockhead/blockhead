import {
	caipOfficialHumanBaseUrl,
	caipsGithubRepo,
} from '$/sources/Caips/Github/constants.ts'
import bindings from '$/sources/Caips/bindings.ts'
import type { CaipsGithubContents } from '$/sources/Caips/Github/types.ts'
import {
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

const binding = bindings[Source.Caips_Github]

export const getContentsUrl = () => githubContentsUrl(caipsGithubRepo)

export const getRawMarkdownUrl = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => (
	downloadUrl ??
	githubRawUrl({
		...caipsGithubRepo,
		path: `${caipsGithubRepo.path}/${fileName}`,
	})
)

export const getMarkdownUrlForNumber = ({ number }: { number: number }) => (
	githubRawUrl({
		...caipsGithubRepo,
		path: `${caipsGithubRepo.path}/caip-${number}.md`,
	})
)

export const getHumanDocUrl = ({ number }: { number: number }) => (
	`${caipOfficialHumanBaseUrl}${number}`
)

export const getContents = (): Promise<CaipsGithubContents> => (
	sourceGetJson(binding, getContentsUrl())
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
