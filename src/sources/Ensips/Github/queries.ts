import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import Ensips from '$/sources/Ensips/index.ts'

import { ensipsGithubRepo } from './constants.ts'
import type { EnsipsGithubContents } from './types.ts'

export const getEnsipsGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: ensipsGithubRepo.owner,
		repo: ensipsGithubRepo.repo,
		pathInRepo: ensipsGithubRepo.path,
		ref: ensipsGithubRepo.ref,
	})
)

export const getEnsipProposalMarkdownUrl = ({ number }: { number: number }) => (
	getGithubRawUserContentUrl({
		owner: ensipsGithubRepo.owner,
		repo: ensipsGithubRepo.repo,
		ref: ensipsGithubRepo.ref,
		pathInRepo: `${ensipsGithubRepo.path}/${number}.md`,
	})
)

export const getEnsipsGithubContents = (): Promise<EnsipsGithubContents> => getJson({
	url: getEnsipsGithubContentsUrl(),
	origins: Ensips.origins ?? [],
})

export const getEnsipProposalMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getEnsipProposalMarkdownUrl({ number }),
		origins: Ensips.origins ?? [],
	})
)
