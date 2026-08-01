import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Helius/bindings.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { HeliusEnhancedTransaction } from '$/sources/Helius/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'

const binding = bindings[Source.Helius].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Helius REST binding is missing')

/** Deprecated by Helius for new parser work, but still the documented parsed transaction endpoint. */
export const getEnhancedTransactions = async ({
	signatures,
	publicEnv,
}: {
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
