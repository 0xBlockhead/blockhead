import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import ZcashZips from '$/sources/ZcashZips/index.ts'

import { zcashZipsGithubRepo } from './constants.ts'
import type { ZcashZipsGithubContents } from './types.ts'

export const getZcashZipsGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: zcashZipsGithubRepo.owner,
		repo: zcashZipsGithubRepo.repo,
		pathInRepo: zcashZipsGithubRepo.path,
		ref: zcashZipsGithubRepo.ref,
	})
)

export const getZcashZipProposalRstUrl = ({ number }: { number: number }) => (
	getGithubRawUserContentUrl({
		owner: zcashZipsGithubRepo.owner,
		repo: zcashZipsGithubRepo.repo,
		ref: zcashZipsGithubRepo.ref,
		pathInRepo: `${zcashZipsGithubRepo.path}/zip-${number.toString().padStart(4, '0')}.rst`,
	})
)

export const getZcashZipsGithubContents = async (): Promise<ZcashZipsGithubContents> => {
	const response = await githubHttp({
		url: getZcashZipsGithubContentsUrl(),
		origins: ZcashZips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('ZcashZips GitHub contents', response)
	return response.json<ZcashZipsGithubContents>()
}

export const getZcashZipProposalRstText = ({ number }: { number: number }) => (
	getText({
		url: getZcashZipProposalRstUrl({ number }),
		origins: ZcashZips.origins ?? [],
	})
)
