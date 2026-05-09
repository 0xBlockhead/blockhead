/**
 * Wire types for `GET https://l2beat.com/api/scaling/summary`.
 * @see https://l2beat.com/api/scaling/summary
 */

export type L2BeatScalingSummaryProject = {
	id: string
	name: string
	slug: string
	type: string
	hostChain: string
	category?: string
	isArchived?: boolean
	isUpcoming?: boolean
	isUnderReview?: boolean
}

export type L2BeatScalingSummaryResponse = {
	projects: Record<string, L2BeatScalingSummaryProject>
}
