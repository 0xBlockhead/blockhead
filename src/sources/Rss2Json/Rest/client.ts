import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { rss2JsonOrigin } from '$/sources/Rss2Json/Rest/constants.ts'
import type { Rss2JsonResponse } from '$/sources/Rss2Json/Rest/types.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const rss2JsonBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find(({ source }) => source === Source.Rss2Json_Rest)
if (rss2JsonBinding == null)
	throw new Error('Rss2Json_Rest: source binding is missing')

export const rss2JsonGet = async (
	path: string
) => (
	sourceGetJson<Rss2JsonResponse>(
		rss2JsonBinding,
		`${rss2JsonOrigin}${path.startsWith('/') ? path : `/${path}`}`
	)
)
