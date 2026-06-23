import { polkadotRfcsBindings } from '$/sources/PolkadotRfcs/bindings.ts'
import type { PolkadotRfcsGithubContents } from '$/sources/PolkadotRfcs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

const polkadotRfcsGithubRepo = {
	owner: 'polkadot-fellows',
	repo: 'RFCs',
	path: 'text',
	ref: 'main',
} as const

export const getContents = (): Promise<PolkadotRfcsGithubContents> => (
	getGithubContents({
		endpoints: polkadotRfcsBindings[0].endpoints,
		target: polkadotRfcsGithubRepo,
	}) as Promise<PolkadotRfcsGithubContents>
)

export const getMarkdownText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: polkadotRfcsBindings[0].endpoints,
		target: {
			...polkadotRfcsGithubRepo,
			path: `${polkadotRfcsGithubRepo.path}/${number.toString().padStart(4, '0')}.md`,
		},
	})
)
