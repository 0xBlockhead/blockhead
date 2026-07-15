import { getText } from '$/lib/http.ts'
import {
	caipOfficialHumanBaseUrl,
	caipsGithubEndpoints,
	caipsGithubOrigins,
	caipsGithubRepo,
} from '$/sources/Caips/Github/constants.ts'
import type { CaipsGithubContents } from '$/sources/Caips/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

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
	getGithubContents({
		endpoints: caipsGithubEndpoints,
		target: caipsGithubRepo,
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
		getGithubRawText({
			endpoints: caipsGithubEndpoints,
			target: {
				...caipsGithubRepo,
				path: `${caipsGithubRepo.path}/${fileName}`,
			},
		})
	:
		getText(downloadUrl, { origins: caipsGithubOrigins })
)

export const getMarkdownTextForNumber = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: caipsGithubEndpoints,
		target: {
			...caipsGithubRepo,
			path: `${caipsGithubRepo.path}/caip-${number}.md`,
		},
	})
)
