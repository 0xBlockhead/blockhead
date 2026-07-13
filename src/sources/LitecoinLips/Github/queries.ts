import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { litecoinLipsBindings } from '$/sources/LitecoinLips/bindings.ts'
import type { LitecoinLipsGithubContents } from '$/sources/LitecoinLips/Github/types.ts'

const litecoinLipsGithubRepo = {
	owner: 'litecoin-project',
	repo: 'lips',
	path: '',
	ref: 'master',
} as const

export const getContents = (): Promise<LitecoinLipsGithubContents> => (
	getGithubContents({
		endpoints: litecoinLipsBindings[0].endpoints,
		target: litecoinLipsGithubRepo,
	})
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: litecoinLipsBindings[0].endpoints,
		target: {
			...litecoinLipsGithubRepo,
			path: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
