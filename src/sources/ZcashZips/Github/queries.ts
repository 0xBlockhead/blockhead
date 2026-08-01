import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.ZcashZips_Github]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getProposalRstUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...target,
		path: `${target.path}/zip-${number.toString().padStart(4, '0')}.rst`,
	})
)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProposalRstText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path: `${target.path}/zip-${number.toString().padStart(4, '0')}.rst`,
		},
	})
)
