import { ensipsGithubRepo } from '$/sources/Ensips/Github/constants.ts'
import bindings from '$/sources/Ensips/bindings.ts'
import type { EnsipsGithubContents } from '$/sources/Ensips/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Ensips_Github]

export const getContentsUrl = () => githubContentsUrl(ensipsGithubRepo)

export const getProposalMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...ensipsGithubRepo,
		path: `${ensipsGithubRepo.path}/${number}.md`,
	})
)

export const getContents = (): Promise<EnsipsGithubContents> => (
	getGithubContents({
		binding,
		target: ensipsGithubRepo,
	})
)

export const getProposalMarkdownText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...ensipsGithubRepo,
			path: `${ensipsGithubRepo.path}/${number}.md`,
		},
	})
)
