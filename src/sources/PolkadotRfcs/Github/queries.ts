import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import PolkadotRfcs from '$/sources/PolkadotRfcs/index.ts'
import type { PolkadotRfcsGithubContents } from '$/sources/PolkadotRfcs/Github/types.ts'

const polkadotRfcsGithubRepo = {
	owner: 'polkadot-fellows',
	repo: 'RFCs',
	path: 'text',
	ref: 'main',
} as const

export const getPolkadotRfcsGithubContents = async (): Promise<PolkadotRfcsGithubContents> => {
	const response = await githubHttp({
		url: getGithubRestRepoContentsUrl({
			owner: polkadotRfcsGithubRepo.owner,
			repo: polkadotRfcsGithubRepo.repo,
			pathInRepo: polkadotRfcsGithubRepo.path,
			ref: polkadotRfcsGithubRepo.ref,
		}),
		origins: PolkadotRfcs.origins ?? [],
	})
	if (!response.ok) await throwHttpError('PolkadotRfcs GitHub contents', response)
	return response.json<PolkadotRfcsGithubContents>()
}

export const getPolkadotRfcMarkdownText = ({ number }: { number: number }) => (
	getText({
		url: getGithubRawUserContentUrl({
			owner: polkadotRfcsGithubRepo.owner,
			repo: polkadotRfcsGithubRepo.repo,
			ref: polkadotRfcsGithubRepo.ref,
			pathInRepo: `${polkadotRfcsGithubRepo.path}/${number.toString().padStart(4, '0')}.md`,
		}),
		origins: PolkadotRfcs.origins ?? [],
	})
)
