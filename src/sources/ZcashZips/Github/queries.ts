import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'
import { zcashZipsGithubRepo } from '$/sources/ZcashZips/Github/constants.ts'
import type { ZcashZipsGithubContents } from '$/sources/ZcashZips/Github/types.ts'

export const getContentsUrl = () => (
	githubContentsUrl(zcashZipsGithubRepo)
)

export const getProposalRstUrl = ({ number }: { number: number }) => (
	githubRawUrl({
		...zcashZipsGithubRepo,
		path: `${zcashZipsGithubRepo.path}/zip-${number.toString().padStart(4, '0')}.rst`,
	})
)

export const getContents = (): Promise<ZcashZipsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: zcashZipsGithubRepo,
	})
)

export const getProposalRstText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...zcashZipsGithubRepo,
			path: `${zcashZipsGithubRepo.path}/zip-${number.toString().padStart(4, '0')}.rst`,
		},
	})
)
