import { polkadotRfcsGithubRepo } from '$/sources/PolkadotRfcs/Github/constants.ts'
import bindings from '$/sources/PolkadotRfcs/bindings.ts'
import type { PolkadotRfcsGithubContents } from '$/sources/PolkadotRfcs/Github/types.ts'
import {
	getGithubContents,
	getGithubRawText,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.PolkadotRfcs_Github]

export const getContents = (): Promise<PolkadotRfcsGithubContents> => (
	getGithubContents({
		binding,
		target: polkadotRfcsGithubRepo,
	})
)

export const getMarkdownText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...polkadotRfcsGithubRepo,
			path: `${polkadotRfcsGithubRepo.path}/${number.toString().padStart(4, '0')}.md`,
		},
	})
)
