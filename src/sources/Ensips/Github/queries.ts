import { getJson, getText } from '$/sources/Github/Rest/client.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import Ensips from '$/sources/Ensips/index.ts'

import { ensipsGithubRepo } from './constants.ts'
import type { EnsipsGithubContents } from './types.ts'

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: ensipsGithubRepo.owner,
		repo: ensipsGithubRepo.repo,
		pathInRepo: ensipsGithubRepo.path,
		ref: ensipsGithubRepo.ref,
	})
)

export const getProposalMarkdownUrl = ({ number }: { number: number }) => (
	getRawUserContentUrl({
		owner: ensipsGithubRepo.owner,
		repo: ensipsGithubRepo.repo,
		ref: ensipsGithubRepo.ref,
		pathInRepo: `${ensipsGithubRepo.path}/${number}.md`,
	})
)

export const getContents = (): Promise<EnsipsGithubContents> => getJson({
	url: getContentsUrl(),
	origins: Ensips.origins ?? [],
})

export const getProposalMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getProposalMarkdownUrl({ number }),
		origins: Ensips.origins ?? [],
	})
)
