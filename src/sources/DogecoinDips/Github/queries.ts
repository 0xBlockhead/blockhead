import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'
import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	dogecoinDipsGithubEndpoints,
	dogecoinDipsGithubRepo,
} from '$/sources/DogecoinDips/Github/constants.ts'

export const getContents = (): Promise<DogecoinDipsGithubContents> => (
	getGithubContents({
		endpoints: dogecoinDipsGithubEndpoints,
		target: dogecoinDipsGithubRepo,
	})
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: dogecoinDipsGithubEndpoints,
		target: {
			...dogecoinDipsGithubRepo,
			path: `dip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
