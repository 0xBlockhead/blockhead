import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getRawUserContentUrl,
	getRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import ZcashZips from '$/sources/ZcashZips/index.ts'

import { zcashZipsGithubRepo } from './constants.ts'
import type { ZcashZipsGithubContents } from './types.ts'

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: zcashZipsGithubRepo.owner,
		repo: zcashZipsGithubRepo.repo,
		pathInRepo: zcashZipsGithubRepo.path,
		ref: zcashZipsGithubRepo.ref,
	})
)

export const getProposalRstUrl = ({ number }: { number: number }) => (
	getRawUserContentUrl({
		owner: zcashZipsGithubRepo.owner,
		repo: zcashZipsGithubRepo.repo,
		ref: zcashZipsGithubRepo.ref,
		pathInRepo: `${zcashZipsGithubRepo.path}/zip-${number.toString().padStart(4, '0')}.rst`,
	})
)

export const getContents = async (): Promise<ZcashZipsGithubContents> => {
	const response = await githubHttp({
		url: getContentsUrl(),
		origins: ZcashZips.origins,
	})
	if (!response.ok) await throwHttpError('ZcashZips GitHub contents', response)
	return response.json<ZcashZipsGithubContents>()
}

export const getProposalRstText = ({ number }: { number: number }) => (
	getText({
		url: getProposalRstUrl({ number }),
		origins: ZcashZips.origins,
	})
)
