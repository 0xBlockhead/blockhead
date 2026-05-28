import { getJson } from '$/sources/Github/Rest/client.ts'
import { getGithubRestRepoContentsUrl } from '$/sources/Github/Rest/queries.ts'
import Caips from '$/sources/Caips/index.ts'

import {
	caipNamespacesGithubRepo,
	caipNamespacesHumanBaseUrl,
} from '$/sources/Caips/Namespaces/Github/constants.ts'
import type { CaipNamespacesGithubContents } from '$/sources/Caips/Namespaces/Github/types.ts'

export const getCaipNamespacesGithubContentsUrl = () => (
	getGithubRestRepoContentsUrl({
		owner: caipNamespacesGithubRepo.owner,
		repo: caipNamespacesGithubRepo.repo,
		pathInRepo: '',
		ref: caipNamespacesGithubRepo.ref,
	})
)

export const getCaipNamespacesGithubContents = (): Promise<CaipNamespacesGithubContents> => getJson<CaipNamespacesGithubContents>({
	url: getCaipNamespacesGithubContentsUrl(),
	origins: Caips.origins ?? [],
})

export const getCaipNamespaceCaip2ProfileUrl = (namespace: string) => (
	`${caipNamespacesHumanBaseUrl}/${namespace}/caip2`
)
