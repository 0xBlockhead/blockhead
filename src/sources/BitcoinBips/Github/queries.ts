import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { bitcoinBipsGithubRepo } from '$/sources/BitcoinBips/Github/constants.ts'
import { bitcoinBipsBindings } from '$/sources/BitcoinBips/bindings.ts'
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
		endpoints: bitcoinBipsBindings[0].endpoints,
		target: bitcoinBipsGithubRepo,
	})
)

export const getProposalMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: bitcoinBipsBindings[0].endpoints,
		target: {
			...bitcoinBipsGithubRepo,
			path: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
