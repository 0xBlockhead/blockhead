/**
 * L2Beat scaling summary — public project order and TVS summary.
 * @see https://l2beat.com/api/scaling/summary
 */

import { getJson } from '$/lib/http.ts'
import {
	l2BeatOrigins,
	origin,
	scalingSummaryPath,
} from '$/sources/L2Beat/Rest/constants.ts'
import type { L2BeatScalingSummaryResponse } from '$/sources/L2Beat/Rest/types.ts'

export const fetchScalingSummary = async (): Promise<L2BeatScalingSummaryResponse> => (
	getJson<L2BeatScalingSummaryResponse>(
		`${origin}${scalingSummaryPath}`,
		{ origins: l2BeatOrigins }
	)
)
