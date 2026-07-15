import {
	caipNamespacesGithubEndpoints,
	caipNamespacesGithubRepo,
	caipNamespacesHumanBaseUrl,
} from '$/sources/Caips/Namespaces/Github/constants.ts'
import type { CaipNamespacesGithubContents } from '$/sources/Caips/Namespaces/Github/types.ts'
import {
	getGithubContents,
	githubContentsUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

export const getContentsUrl = () => (
	githubContentsUrl(caipNamespacesGithubRepo)
)

export const getContents = (): Promise<CaipNamespacesGithubContents> => (
	getGithubContents({
		endpoints: caipNamespacesGithubEndpoints,
		target: caipNamespacesGithubRepo,
	})
)

export const getProfileUrl = (namespace: string) => (
	`${caipNamespacesHumanBaseUrl}/${namespace}/caip2`
)
