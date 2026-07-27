import {
	caipNamespacesGithubRepo,
	caipNamespacesHumanBaseUrl,
} from '$/sources/Caips/Namespaces/Github/constants.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { CaipNamespacesGithubContents } from '$/sources/Caips/Namespaces/Github/types.ts'
import {
	getGithubContents,
	githubContentsUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'

export const getContentsUrl = () => (
	githubContentsUrl(caipNamespacesGithubRepo)
)

export const getContents = (
	binding: SourceBinding
): Promise<CaipNamespacesGithubContents> => (
	getGithubContents({
		binding,
		target: caipNamespacesGithubRepo,
	})
)

export const getProfileUrl = (namespace: string) => (
	`${caipNamespacesHumanBaseUrl}/${namespace}/caip2`
)
