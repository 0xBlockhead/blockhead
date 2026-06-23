import { ensipsBindings } from '$/sources/Ensips/bindings.ts'
import { ensipsGithubRepo } from '$/sources/Ensips/Github/constants.ts'
import type { EnsipsGithubContents } from '$/sources/Ensips/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

export const getContentsUrl = () => githubContentsUrl(ensipsGithubRepo)

export const getProposalMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...ensipsGithubRepo,
		path: `${ensipsGithubRepo.path}/${number}.md`,
	})
)

export const getContents = (): Promise<EnsipsGithubContents> => (
	getGithubContents({
		endpoints: ensipsBindings[0].endpoints,
		target: ensipsGithubRepo,
	}) as Promise<EnsipsGithubContents>
)

export const getProposalMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: ensipsBindings[0].endpoints,
		target: {
			...ensipsGithubRepo,
			path: `${ensipsGithubRepo.path}/${number}.md`,
		},
	})
)
