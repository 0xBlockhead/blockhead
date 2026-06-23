import { getJson } from '$/lib/http.ts'
import { bitcoinCashBcmrBindings } from '$/sources/BitcoinCashBcmr/bindings.ts'
import type { BcmrRegistry } from '$/sources/BitcoinCashBcmr/Github/types.ts'

const origins = bitcoinCashBcmrBindings[0].endpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

export const getRegistry = ({ url }: { url: string }) => (
	getJson<BcmrRegistry>(
		url,
		{ origins }
	)
)
