import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'

const origin = 'https://api-mainnet.helius-rpc.com'
const heliusOrigins = [
	{
		origin,
		corsEnabled: true,
	},
] as const

/** Deprecated by Helius for new parser work, but still the documented parsed transaction endpoint. */
export const getEnhancedTransactions = async ({
	signatures,
	publicEnv,
}: {
	signatures: readonly string[]
	publicEnv: SourcePublicEnv
}) => {
	const response = await corsFetch(`${origin}/v0/transactions/?api-key=${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_HELIUS_API_KEY'))}`, {
		origins: heliusOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				transactions: [...signatures],
			}),
		},
	})
	if (!response.ok) await throwHttpError('Helius enhanced transactions', response)
	return response.json<HeliusEnhancedTransaction[]>()
}
