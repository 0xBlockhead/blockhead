/**
 * L2Beat scaling summary — public project order and TVS summary.
 * @see https://l2beat.com/api/scaling/summary
 */

import bindings from '$/sources/L2Beat/bindings.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { scalingSummaryPath } from '$/sources/L2Beat/Rest/constants.ts'
import type { L2BeatScalingSummaryResponse } from '$/sources/L2Beat/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

export const fetchScalingSummary = () => (
	getJson<L2BeatScalingSummaryResponse>(
		bindings[Source.L2Beat_Rest][0],
		scalingSummaryPath
	)
)
