export type BeaconchaInResponse<_Data> = {
	status?: string
	data?: _Data
}

export type BeaconchaInEpoch = {
	epoch?: number
	ts?: string
	finalized?: boolean
	validatorscount?: number
	averagevalidatorbalance?: number
	totalvalidatorbalance?: number
	globalparticipationrate?: number
	eligibleether?: number
	votedether?: number
	blockscount?: number
	proposedblocks?: number
	missedblocks?: number
	orphanedblocks?: number
	scheduledblocks?: number
	attestationscount?: number
	attesterslashingscount?: number
	proposerslashingscount?: number
	depositscount?: number
	withdrawalcount?: number
	voluntaryexitscount?: number
	rewards_exported?: boolean
}
