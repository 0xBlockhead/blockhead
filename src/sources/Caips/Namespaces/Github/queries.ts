import {
	caipNamespacesHumanBaseUrl,
} from '$/sources/Caips/Namespaces/Github/constants.ts'
import bindings from '$/sources/Caips/bindings.ts'
import {
	getGithubContents,
	githubContentsUrl,
	githubRepositoryTargetFromKey,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CaipNamespaces_Github][0]
const target = githubRepositoryTargetFromKey(binding.target.key)

export const getContentsUrl = () => (
	githubContentsUrl(target)
)

export const getContents = () => (
	getGithubContents({
		binding,
		target,
	})
)

export const getProfileUrl = (namespace: string) => (
	`${caipNamespacesHumanBaseUrl}/${namespace}/caip2`
)
