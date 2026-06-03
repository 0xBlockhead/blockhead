import { getJson } from '$/sources/Github/Rest/client.ts'
import { getRestRepoContentsUrl } from '$/sources/Github/Rest/queries.ts'
import Caips from '$/sources/Caips/index.ts'

import {
	caipNamespacesGithubRepo,
	caipNamespacesHumanBaseUrl,
} from '$/sources/Caips/Namespaces/Github/constants.ts'
import type { CaipNamespacesGithubContents } from '$/sources/Caips/Namespaces/Github/types.ts'

export const getContentsUrl = () => (
	getRestRepoContentsUrl({
		owner: caipNamespacesGithubRepo.owner,
		repo: caipNamespacesGithubRepo.repo,
		pathInRepo: '',
		ref: caipNamespacesGithubRepo.ref,
	})
)

export const getContents = (): Promise<CaipNamespacesGithubContents> => getJson<CaipNamespacesGithubContents>({
	url: getContentsUrl(),
	origins: Caips.origins,
})

export const getProfileUrl = (namespace: string) => (
	`${caipNamespacesHumanBaseUrl}/${namespace}/caip2`
)
