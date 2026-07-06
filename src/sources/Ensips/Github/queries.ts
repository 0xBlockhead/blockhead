import { ensipsGithubRepo } from '$/sources/Ensips/Github/constants.ts'
import type { EnsipsGithubContents } from '$/sources/Ensips/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const getContentsUrl = () => githubContentsUrl(ensipsGithubRepo)

export const getProposalMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...ensipsGithubRepo,
		path: `${ensipsGithubRepo.path}/${number}.md`,
	})
)

export const getContents = (): Promise<EnsipsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: ensipsGithubRepo,
	}) as Promise<EnsipsGithubContents>
)

export const getProposalMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...ensipsGithubRepo,
			path: `${ensipsGithubRepo.path}/${number}.md`,
		},
	})
)
