import type { DogecoinDipsGithubContents } from '$/sources/DogecoinDips/Github/types.ts'
import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { regex } from 'arkregex'

const dogecoinDipsGithubBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.DogecoinDips_Github
		&& binding.target.kind === SourceTargetKind.GitRepository
	))

if (dogecoinDipsGithubBindings.length !== 1)
	throw new Error('DogecoinDips_Github: canonical Git repository source binding is missing or ambiguous')

const dogecoinDipsGithubBinding = dogecoinDipsGithubBindings[0]
const dogecoinDipsGithubTarget = regex('^(?<owner>[^/]+)/(?<repo>[^@]+)@(?<ref>[^:]+):(?<path>.*)$')
	.exec(dogecoinDipsGithubBinding.target.key)?.groups

if (dogecoinDipsGithubTarget == null)
	throw new Error('DogecoinDips_Github: source binding has an invalid Git repository target')

export const getContents = (): Promise<DogecoinDipsGithubContents> => (
	getGithubContents({
		endpoints: dogecoinDipsGithubBinding.endpoints,
		target: dogecoinDipsGithubTarget,
	})
)

export const getMediaWikiText = ({ number }: { number: number }) => (
	getGithubRawText({
		endpoints: dogecoinDipsGithubBinding.endpoints,
		target: {
			...dogecoinDipsGithubTarget,
			path: `dip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
