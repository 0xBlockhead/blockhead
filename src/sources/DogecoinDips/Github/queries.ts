import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'
import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const dogecoinDipsGithubRepo = {
	owner: 'dogecoin',
	repo: 'dips',
	path: '',
	ref: 'master',
} as const

export const getContents = (): Promise<DogecoinDipsGithubContents> => (
	getGithubContents({
		endpoints: githubHttpEndpoints,
		target: dogecoinDipsGithubRepo,
	})
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: githubHttpEndpoints,
		target: {
			...dogecoinDipsGithubRepo,
			path: `dip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
