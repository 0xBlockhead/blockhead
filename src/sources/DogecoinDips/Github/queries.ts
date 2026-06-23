import { getGithubContents, getGithubRawText, githubContentsUrl, githubRawUrl } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { dogecoinDipsBindings } from '$/sources/DogecoinDips/bindings.ts'
import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'

const dogecoinDipsGithubRepo = {
	owner: 'dogecoin',
	repo: 'dips',
	path: '',
	ref: 'master',
} as const

export const getContents = (): Promise<DogecoinDipsGithubContents> => (
	getGithubContents({
		endpoints: dogecoinDipsBindings[0].endpoints,
		target: dogecoinDipsGithubRepo,
	}) as Promise<DogecoinDipsGithubContents>
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: dogecoinDipsBindings[0].endpoints,
		target: {
			...dogecoinDipsGithubRepo,
			path: `dip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
