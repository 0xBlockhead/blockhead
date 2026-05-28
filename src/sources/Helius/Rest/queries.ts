import { corsFetch, throwHttpError } from '$/lib/http.ts'
import Helius from '$/sources/Helius/index.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'

const origin = 'https://api.helius.xyz'

export const getEnhancedTransactions = async ({
	signatures,
	publicEnv,
}: {
	signatures: readonly string[]
	publicEnv: SourcePublicEnvFor<Source.Helius_Rest>
}) => {
	const response = await corsFetch(`${origin}/v0/transactions/?api-key=${encodeURIComponent(publicEnv.PUBLIC_HELIUS_API_KEY)}`, {
		origins: Helius.origins ?? [],
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
