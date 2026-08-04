/**
 * Types for `GET https://l2beat.com/api/scaling/summary`.
 * @see https://l2beat.com/api/scaling/summary
 */

export type L2BeatScalingSummaryProject = {
	id: string
	name: string
	slug: string
	/** Wire kind (`layer2` / `layer3`), not the rollup category label. */
	type: string
	/** Settled-on / host chain label; maps via `l2BeatHostChainByLabel`. */
	hostChain: string
	category?: string
	stage?: string
	isArchived?: boolean
	isUpcoming?: boolean
	isUnderReview?: boolean
	providers?: string[]
	purposes?: string[]
	badges?: {
		id: string
		type: string
		name: string
		description?: string
	}[]
	risks?: {
		name: string
		value: string
		sentiment?: string
		description?: string
	}[]
	tvs?: {
		breakdown?: {
			total?: number
			native?: number
			canonical?: number
			external?: number
		}
		change7d?: number
	}
}

export type L2BeatScalingSummaryResponse = {
	projects: Partial<Record<string, L2BeatScalingSummaryProject>>
	chart: {
		/** Unix seconds; L2Beat summary freshness clock. */
		syncedUntil: number
		types?: string[]
		data?: unknown[]
	}
}
