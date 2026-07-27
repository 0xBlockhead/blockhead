import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import {
	litecoinLipsGithubRepo,
} from '$/sources/LitecoinLips/Github/constants.ts'
import bindings from '$/sources/LitecoinLips/bindings.ts'
import type { LitecoinLipsGithubContents } from '$/sources/LitecoinLips/Github/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.LitecoinLips_Github]

export const getContents = (): Promise<LitecoinLipsGithubContents> => (
	getGithubContents({
		binding,
		target: litecoinLipsGithubRepo,
	})
)

export const getMediaWikiText = ({
	number,
}: {
	number: number
}) => (
	getGithubRawText({
		binding,
		target: {
			...litecoinLipsGithubRepo,
			path: `lip-${number.toString().padStart(4, '0')}.mediawiki`,
		},
	})
)
