import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'
import { zcashZipsGithubRepo } from '$/sources/ZcashZips/Github/constants.ts'
import type { ZcashZipsGithubContents } from '$/sources/ZcashZips/Github/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.ZcashZips_Github]

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
		binding,
		target: zcashZipsGithubRepo,
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
			...zcashZipsGithubRepo,
			path: `${zcashZipsGithubRepo.path}/zip-${number.toString().padStart(4, '0')}.rst`,
		},
	})
)
