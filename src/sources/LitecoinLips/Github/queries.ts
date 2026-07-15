import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	litecoinLipsGithubEndpoints,
	litecoinLipsGithubRepo,
} from '$/sources/LitecoinLips/Github/constants.ts'
import type { LitecoinLipsGithubContents } from '$/sources/LitecoinLips/Github/types.ts'

export const getContents = (): Promise<LitecoinLipsGithubContents> => (
	getGithubContents({
		endpoints: litecoinLipsGithubEndpoints,
		target: litecoinLipsGithubRepo,
	})
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: litecoinLipsGithubEndpoints,
		target: {
			...litecoinLipsGithubRepo,
			path: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
