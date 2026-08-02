import bindings from '$/sources/Ensips/bindings.ts'
import {
	getGithubContents,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { sourceGetText } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Ensips_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => githubContentsUrl(target)

export const getProposalMarkdownUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...target,
		path: `${target.path}/${number}.md`,
	})
)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProposalMarkdownText = ({
	number,
}: {
	number: number
}) => (
	sourceGetText(binding, getProposalMarkdownUrl({ number }))
)
