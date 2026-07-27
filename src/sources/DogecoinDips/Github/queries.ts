import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'
import bindings from '$/sources/DogecoinDips/bindings.ts'
import {
	githubContentsUrl,
	githubRawUrl,
} from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	sourceGetJson,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import { regex } from 'arkregex'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.DogecoinDips_Github]

const githubRepositoryTarget = regex('^(?<owner>[^/]+)/(?<repo>[^@]+)@(?<ref>[^:]+):(?<path>.*)$')

export const getContents = (): Promise<DogecoinDipsGithubContents> => {
	const target = githubRepositoryTarget.exec(binding.target.key)?.groups
	if (target == null)
		throw new Error('DogecoinDips_Github: source binding has an invalid Git repository target')

	return sourceGetJson<DogecoinDipsGithubContents>(binding, githubContentsUrl(target))
}

export const getMediaWikiText = ({
	number,
}: {
	number: number
}) => {
	const target = githubRepositoryTarget.exec(binding.target.key)?.groups
	if (target == null)
		throw new Error('DogecoinDips_Github: source binding has an invalid Git repository target')

	return sourceGetText(binding, githubRawUrl({
		...target,
		path: [
			target.path,
			`dip-${number.toString().padStart(4, '0')}.mediawiki`,
		].filter(Boolean).join('/'),
	}))
}
