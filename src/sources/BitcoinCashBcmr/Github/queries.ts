import { getJson } from '$/lib/http.ts'
import type { BcmrRegistry } from '$/sources/BitcoinCashBcmr/Github/types.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const origins = githubHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

export const getRegistry = ({ url }: { url: string }) => (
	getJson<BcmrRegistry>(
		url,
		{ origins }
	)
)
