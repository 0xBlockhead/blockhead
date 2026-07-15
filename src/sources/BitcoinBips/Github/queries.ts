import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	bitcoinBipsGithubEndpoints,
	bitcoinBipsGithubRepo,
} from '$/sources/BitcoinBips/Github/constants.ts'
import type { BitcoinBipsGithubContents } from '$/sources/BitcoinBips/Github/types.ts'

export const getContentsUrl = () => (
	githubContentsUrl(bitcoinBipsGithubRepo)
)

export const getProposalMediaWikiUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...bitcoinBipsGithubRepo,
		path: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
	})
)

export const getContents = (): Promise<BitcoinBipsGithubContents> => (
	getGithubContents({
		endpoints: bitcoinBipsGithubEndpoints,
		target: bitcoinBipsGithubRepo,
	})
)

export const getProposalMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: bitcoinBipsGithubEndpoints,
		target: {
			...bitcoinBipsGithubRepo,
			path: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
