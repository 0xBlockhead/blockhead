import {
	getGithubContents,
	getGithubRawText,
	githubContentsUrl,
	githubRawUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.BitcoinBips_Github]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getProposalMediaWikiUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...target,
		path: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
	})
)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProposalMediaWikiText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...target,
			path: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
