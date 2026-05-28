import { getText, githubHttp } from '$/sources/Github/Rest/client.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	getGithubRawUserContentUrl,
	getGithubRestRepoContentsUrl,
} from '$/sources/Github/Rest/queries.ts'
import DogecoinDips from '$/sources/DogecoinDips/index.ts'
import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'

const dogecoinDipsGithubRepo = {
	owner: 'dogecoin',
	repo: 'dips',
	path: '',
	ref: 'master',
} as const

export const getDogecoinDipsGithubContents = async (): Promise<DogecoinDipsGithubContents> => {
	const response = await githubHttp({
		url: getGithubRestRepoContentsUrl({
			owner: dogecoinDipsGithubRepo.owner,
			repo: dogecoinDipsGithubRepo.repo,
			pathInRepo: dogecoinDipsGithubRepo.path,
			ref: dogecoinDipsGithubRepo.ref,
		}),
		origins: DogecoinDips.origins ?? [],
	})
	if (!response.ok) await throwHttpError('DogecoinDips GitHub contents', response)
	return response.json<DogecoinDipsGithubContents>()
}

export const getDogecoinDipMediaWikiText = ({ number }: { number: number }) => (
	getText({
		url: getGithubRawUserContentUrl({
			owner: dogecoinDipsGithubRepo.owner,
			repo: dogecoinDipsGithubRepo.repo,
			ref: dogecoinDipsGithubRepo.ref,
			pathInRepo: `dip-${number.toString().padStart(4, '0')}.mediawiki`,
		}),
		origins: DogecoinDips.origins ?? [],
	})
)
