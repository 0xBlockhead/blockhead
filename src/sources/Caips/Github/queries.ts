import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'

import { caipOfficialHumanBaseUrl, caipsGithubRepo } from './constants.ts'

export const getCaipsGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		pathInRepo: caipsGithubRepo.path,
		ref: caipsGithubRepo.ref,
	})
)

export const getCaipsRawMarkdownUrl = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => (
	downloadUrl ??
	getGithubRawUserContentUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		ref: caipsGithubRepo.ref,
		pathInRepo: `${caipsGithubRepo.path}/${fileName}`,
	})
)

export const getCaipMarkdownUrlForNumber = ({ number }: { number: number }) => (
	getGithubRawUserContentUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		ref: caipsGithubRepo.ref,
		pathInRepo: `${caipsGithubRepo.path}/caip-${number}.md`,
	})
)

export const getCaipHumanDocUrl = ({ number }: { number: number }) => (
	`${caipOfficialHumanBaseUrl}${number}`
)

export const getCaipsGithubContents = () => getJson({ url: getCaipsGithubContentsUrl() })

export const getCaipsRawMarkdownText = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => getText({ url: getCaipsRawMarkdownUrl({ fileName, downloadUrl }) })

export const getCaipMarkdownTextForNumber = ({ number }: { number: number }) => (
	getText({ url: getCaipMarkdownUrlForNumber({ number }) })
)
