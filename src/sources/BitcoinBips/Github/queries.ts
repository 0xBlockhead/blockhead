import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import BitcoinBips from '$/sources/BitcoinBips/index.ts'

import { bitcoinBipsGithubRepo } from './constants.ts'
import type { BitcoinBipsGithubContents } from './types.ts'

export const getBitcoinBipsGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: bitcoinBipsGithubRepo.owner,
		repo: bitcoinBipsGithubRepo.repo,
		pathInRepo: bitcoinBipsGithubRepo.path,
		ref: bitcoinBipsGithubRepo.ref,
	})
)

export const getBitcoinBipProposalMediaWikiUrl = ({ number }: { number: number }) => (
	getGithubRawUserContentUrl({
		owner: bitcoinBipsGithubRepo.owner,
		repo: bitcoinBipsGithubRepo.repo,
		ref: bitcoinBipsGithubRepo.ref,
		pathInRepo: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
	})
)

export const getBitcoinBipsGithubContents = async (): Promise<BitcoinBipsGithubContents> => {
	const response = await githubHttp({
		url: getBitcoinBipsGithubContentsUrl(),
		origins: BitcoinBips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('BitcoinBips GitHub contents', response)
	return response.json<BitcoinBipsGithubContents>()
}

export const getBitcoinBipProposalMediaWikiText = ({ number }: { number: number }) => (
	getText({
		url: getBitcoinBipProposalMediaWikiUrl({ number }),
		origins: BitcoinBips.origins ?? [],
	})
)
