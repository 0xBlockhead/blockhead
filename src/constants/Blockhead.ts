// Types

import { BlockheadFarcasterConnectionAuthMethod } from '$/schema/BlockheadFarcasterAccountConnection.ts'
import { BlockheadAgentConversationTurnStatus } from '$/schema/BlockheadAgentConversationTurn.ts'
import { BlockheadSessionStatus } from '$/schema/BlockheadSession.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'


// Constants

const blockheadAgentConversationTurnStatuses = [
	{
		status: BlockheadAgentConversationTurnStatus.Pending,
		label: 'Pending',
	},
	{
		status: BlockheadAgentConversationTurnStatus.Generating,
		label: 'Generating',
	},
	{
		status: BlockheadAgentConversationTurnStatus.Complete,
		label: 'Complete',
	},
	{
		status: BlockheadAgentConversationTurnStatus.Error,
		label: 'Error',
	},
	{
		status: BlockheadAgentConversationTurnStatus.Cancelled,
		label: 'Cancelled',
	},
] as const satisfies readonly {
	status: BlockheadAgentConversationTurnStatus
	label: string
}[]

const blockheadSessionStatuses = [
	{
		status: BlockheadSessionStatus.Draft,
		label: 'Draft',
	},
	{
		status: BlockheadSessionStatus.Submitted,
		label: 'Submitted',
	},
	{
		status: BlockheadSessionStatus.Finalized,
		label: 'Finalized',
	},
] as const satisfies readonly {
	status: BlockheadSessionStatus
	label: string
}[]

const blockheadWalletConnectionStatuses = [
	{
		status: BlockheadConnectionStatus.Disconnected,
		label: 'Disconnected',
	},
	{
		status: BlockheadConnectionStatus.Connecting,
		label: 'Connecting',
	},
	{
		status: BlockheadConnectionStatus.Connected,
		label: 'Connected',
	},
	{
		status: BlockheadConnectionStatus.Error,
		label: 'Error',
	},
] as const satisfies readonly {
	status: BlockheadConnectionStatus
	label: string
}[]

const blockheadFarcasterConnectionAuthMethods = [
	{
		authMethod: BlockheadFarcasterConnectionAuthMethod.Custody,
		label: 'Custody address',
	},
	{
		authMethod: BlockheadFarcasterConnectionAuthMethod.AuthAddress,
		label: 'Auth address',
	},
] as const satisfies readonly {
	authMethod: BlockheadFarcasterConnectionAuthMethod
	label: string
}[]


// Lookups

export const blockheadSessionStatusByStatus = Object.fromEntries(
	blockheadSessionStatuses.map((row) => [
		row.status,
		row,
	])
)

export const blockheadWalletConnectionStatusByStatus = Object.fromEntries(
	blockheadWalletConnectionStatuses.map((row) => [
		row.status,
		row,
	])
)

export const blockheadFarcasterConnectionAuthMethodByAuthMethod = Object.fromEntries(
	blockheadFarcasterConnectionAuthMethods.map((row) => [
		row.authMethod,
		row,
	])
)

export const blockheadAgentConversationTurnStatusByStatus = Object.fromEntries(
	blockheadAgentConversationTurnStatuses.map((row) => [
		row.status,
		row,
	])
)
