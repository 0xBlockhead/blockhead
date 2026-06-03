import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import Caips from '$/sources/Caips/index.ts'

import { caipOfficialHumanBaseUrl, caipsGithubRepo } from './constants.ts'
import type { CaipsGithubContents } from './types.ts'

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		pathInRepo: caipsGithubRepo.path,
		ref: caipsGithubRepo.ref,
	})
)

export const getRawMarkdownUrl = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => (
	downloadUrl ??
	getRawUserContentUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		ref: caipsGithubRepo.ref,
		pathInRepo: `${caipsGithubRepo.path}/${fileName}`,
	})
)

export const getMarkdownUrlForNumber = ({ number }: { number: number }) => (
	getRawUserContentUrl({
		owner: caipsGithubRepo.owner,
		repo: caipsGithubRepo.repo,
		ref: caipsGithubRepo.ref,
		pathInRepo: `${caipsGithubRepo.path}/caip-${number}.md`,
	})
)

export const getHumanDocUrl = ({ number }: { number: number }) => (
	`${caipOfficialHumanBaseUrl}${number}`
)

export const getContents = (): Promise<CaipsGithubContents> => getJson<CaipsGithubContents>({
	url: getContentsUrl(),
	origins: Caips.origins,
})

export const getRawMarkdownText = ({
	fileName,
	downloadUrl,
}: {
	fileName: string
	downloadUrl: string | null | undefined
}) => getText({
	url: getRawMarkdownUrl({ fileName, downloadUrl }),
	origins: Caips.origins,
})

export const getMarkdownTextForNumber = ({ number }: { number: number }) => (
	getText({
		url: getMarkdownUrlForNumber({ number }),
		origins: Caips.origins,
	})
)
