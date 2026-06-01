import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import BitcoinBips from '$/sources/BitcoinBips/index.ts'

import { bitcoinBipsGithubRepo } from './constants.ts'
import type { BitcoinBipsGithubContents } from './types.ts'

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: bitcoinBipsGithubRepo.owner,
		repo: bitcoinBipsGithubRepo.repo,
		pathInRepo: bitcoinBipsGithubRepo.path,
		ref: bitcoinBipsGithubRepo.ref,
	})
)

export const getProposalMediaWikiUrl = ({ number }: { number: number }) => (
	getRawUserContentUrl({
		owner: bitcoinBipsGithubRepo.owner,
		repo: bitcoinBipsGithubRepo.repo,
		ref: bitcoinBipsGithubRepo.ref,
		pathInRepo: `bip-${number.toString().padStart(4, '0')}.mediawiki`,
	})
)

export const getContents = async (): Promise<BitcoinBipsGithubContents> => {
	const response = await githubHttp({
		url: getContentsUrl(),
		origins: BitcoinBips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('BitcoinBips GitHub contents', response)
	return response.json<BitcoinBipsGithubContents>()
}

export const getProposalMediaWikiText = ({ number }: { number: number }) => (
	getText({
		url: getProposalMediaWikiUrl({ number }),
		origins: BitcoinBips.origins ?? [],
	})
)
