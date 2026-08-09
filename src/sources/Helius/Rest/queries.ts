import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'

/** Deprecated by Helius for new parser work, but still the documented parsed transaction endpoint. */
export const getEnhancedTransactions = async ({
	binding,
	signatures,
	publicEnv,
}: {
	binding: SourceBinding
	signatures: readonly string[]
	publicEnv: SourcePublicEnv
}) => {
	const response = await sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/v0/transactions/?api-key=${encodeURIComponent(requiredPublicEnvString(publicEnv, 'PUBLIC_HELIUS_API_KEY'))}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				transactions: [...signatures],
			}),
		}
	)
	if (!response.ok) await throwHttpError('Helius enhanced transactions', response)
	return response.json<HeliusEnhancedTransaction[]>()
}
