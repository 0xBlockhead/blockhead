import { duneFetch } from '$/sources/Dune/Rest/client.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

/**
 * `POST /api/v1/usage` — billing period credits (metadata; does not consume query credits).
 * @see https://docs.dune.com/api-reference/usage/endpoint/get-usage.md
 */
export const getUsage = (
	publicEnv: SourcePublicEnv,
	body?: { start_date?: string; end_date?: string }
) => {
	return duneFetch<{
		billingPeriods?: { credits_used?: number; credits_included?: number }[]
		billing_periods?: { credits_used?: number; credits_included?: number }[]
	}>(publicEnv, '/api/v1/usage', {
		method: 'POST',
		body: JSON.stringify(body ?? {}),
	})
}
