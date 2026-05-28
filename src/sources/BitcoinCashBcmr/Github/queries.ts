import { getJson } from '$/lib/http.ts'
import BitcoinCashBcmr from '$/sources/BitcoinCashBcmr/index.ts'
import type { BcmrRegistry } from '$/sources/BitcoinCashBcmr/Github/types.ts'

export const getBcmrRegistry = ({ url }: { url: string }) => (
	getJson<BcmrRegistry>(
		url,
		{ origins: BitcoinCashBcmr.origins ?? [] },
	)
)
