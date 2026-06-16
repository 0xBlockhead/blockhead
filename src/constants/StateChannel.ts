// Constants

export const stateChannelStatuses = [
	{
		status: 'pending',
		label: 'Pending',
	},
	{
		status: 'active',
		label: 'Active',
	},
	{
		status: 'closing',
		label: 'Closing',
	},
	{
		status: 'closed',
		label: 'Closed',
	},
	{
		status: 'disputed',
		label: 'Disputed',
	},
] as const satisfies readonly {
	status: 'pending' | 'active' | 'closing' | 'closed' | 'disputed'
	label: string
}[]


// Lookups

export const stateChannelStatusByStatus = Object.fromEntries(
	stateChannelStatuses.map((row) => [
		row.status,
		row,
	])
)

export const stateChannelTransferStatuses = [
	{
		status: 'pending',
		label: 'Pending',
	},
	{
		status: 'confirmed',
		label: 'Confirmed',
	},
	{
		status: 'failed',
		label: 'Failed',
	},
] as const satisfies readonly {
	status: 'pending' | 'confirmed' | 'failed'
	label: string
}[]

export const stateChannelTransferStatusByStatus = Object.fromEntries(
	stateChannelTransferStatuses.map((row) => [
		row.status,
		row,
	])
)

const stateChannelStateIntents = [
	{
		intent: 0,
		label: 'Operate',
	},
	{
		intent: 1,
		label: 'Finalize',
	},
	{
		intent: 2,
		label: 'Withdraw',
	},
	{
		intent: 3,
		label: 'Dispute',
	},
] as const satisfies readonly {
	intent: number
	label: string
}[]

export const stateChannelStateIntentByIntent = Object.fromEntries(
	stateChannelStateIntents.map((row) => [
		row.intent,
		row,
	])
)
