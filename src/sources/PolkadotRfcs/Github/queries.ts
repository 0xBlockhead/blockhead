import {
	polkadotRfcsGithubEndpoints,
	polkadotRfcsGithubRepo,
} from '$/sources/PolkadotRfcs/Github/constants.ts'
import type { PolkadotRfcsGithubContents } from '$/sources/PolkadotRfcs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

export const getContents = (): Promise<PolkadotRfcsGithubContents> => (
	getGithubContents({
		endpoints: polkadotRfcsGithubEndpoints,
		target: polkadotRfcsGithubRepo,
	})
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: polkadotRfcsGithubEndpoints,
		target: {
			...polkadotRfcsGithubRepo,
			path: `${polkadotRfcsGithubRepo.path}/${number.toString().padStart(4, '0')}.md`,
		},
	})
)
