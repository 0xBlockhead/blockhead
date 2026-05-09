/**
 * L2Beat scaling summary — public project order and TVS summary.
 * @see https://l2beat.com/api/scaling/summary
 */

import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import L2Beat from '$/sources/L2Beat/index.ts'
import {
	origin,
	scalingSummaryPath,
} from '$/sources/L2Beat/Rest/constants.ts'
import type { L2BeatScalingSummaryResponse } from '$/sources/L2Beat/Rest/types.ts'

const fetchScalingSummaryOnce = async (): Promise<L2BeatScalingSummaryResponse> => (
	getJson<L2BeatScalingSummaryResponse>(
		`${origin}${scalingSummaryPath}`,
		{ origins: L2Beat.origins },
	)
)

export const fetchScalingSummary = singleFlight(fetchScalingSummaryOnce)
