import { ActionType } from '$/constants/actions.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'


export type TransferDraftFields = {
	fromActor: string
	toActor: string
	chainId: string
	tokenAddress: string
	amount: string
}

export type SwapDraftFields = {
	chainId: string
	tokenIn: string
	tokenOut: string
	amount: string
	slippage: string
}

export type BridgeDraftFields = {
	fromChainId: string
	toChainId: string
	tokenAddress: string
	amount: string
	slippage: string
}

export type SessionActionDraftFields =
	| {
		actionType: ActionType.Transfer
		fields: TransferDraftFields
	}
	| {
		actionType: ActionType.Swap
		fields: SwapDraftFields
	}
	| {
		actionType: ActionType.Bridge
		fields: BridgeDraftFields
	}

type SessionActionDraftEditIdentity = {
	selector: EntitySelector<typeof schema, EntityType.BlockheadSessionAction>
	indexInSequence: number
	createdAt: number
}

export type SessionActionDraft =
	| {
		mode: 'idle'
	}
	| (
		SessionActionDraftFields & {
			mode: 'create'
		}
	)
	| (
		SessionActionDraftFields & {
			mode: 'edit'
		} & SessionActionDraftEditIdentity
	)

export type SessionComposerReadinessCheckId = string

export type SessionComposerNotice =
	| {
		status: 'idle'
	}
	| {
		status: 'info'
		message: string
	}
	| {
		status: 'error'
		message: string
	}
	| {
		status: 'preparing'
	}
	| {
		status: 'prepared'
		message: string
		readinessCheckIds: readonly SessionComposerReadinessCheckId[]
	}
	| {
		status: 'preparedWithWalletRequest'
		message: string
		walletRequestId: string
		readinessCheckIds: readonly SessionComposerReadinessCheckId[]
	}
	| {
		status: 'preparationBlocked'
		message: string
		readinessCheckIds: readonly SessionComposerReadinessCheckId[]
	}
	| {
		status: 'preparationFailed'
		message: string
		readinessCheckIds: readonly SessionComposerReadinessCheckId[]
	}


export const idleSessionActionDraft = {
	mode: 'idle',
} as const satisfies SessionActionDraft

export const idleSessionComposerNotice = {
	status: 'idle',
} as const satisfies SessionComposerNotice

export const nextSessionActionIndexInSequence = (
	existingIndexes: readonly number[]
) => (
	existingIndexes.length === 0 ?
		0
	:
		Math.max(...existingIndexes) + 1
)

export const emptyTransferDraftFields = (): TransferDraftFields => ({
	fromActor: '',
	toActor: '',
	chainId: '',
	tokenAddress: '',
	amount: '',
})

export const emptySwapDraftFields = (): SwapDraftFields => ({
	chainId: '',
	tokenIn: '',
	tokenOut: '',
	amount: '',
	slippage: '0.005',
})

export const emptyBridgeDraftFields = (): BridgeDraftFields => ({
	fromChainId: '',
	toChainId: '',
	tokenAddress: '',
	amount: '',
	slippage: '0.005',
})

export const emptyDraftFieldsForActionType = (
	actionType: ActionType
): SessionActionDraftFields => {
	switch (actionType) {
		case ActionType.Transfer:
			return {
				actionType,
				fields: emptyTransferDraftFields(),
			}
		case ActionType.Swap:
			return {
				actionType,
				fields: emptySwapDraftFields(),
			}
		case ActionType.Bridge:
			return {
				actionType,
				fields: emptyBridgeDraftFields(),
			}
	}
}

export const createSessionActionDraft = (
	fields: SessionActionDraftFields
): Extract<SessionActionDraft, { mode: 'create' }> => ({
	mode: 'create',
	...fields,
})

export const editSessionActionDraft = (
	fields: SessionActionDraftFields,
	identity: SessionActionDraftEditIdentity
): Extract<SessionActionDraft, { mode: 'edit' }> => ({
	mode: 'edit',
	...fields,
	...identity,
})

export const retargetSessionActionDraft = (
	draft: Exclude<SessionActionDraft, { mode: 'idle' }>,
	actionType: ActionType
): Exclude<SessionActionDraft, { mode: 'idle' }> => {
	const fields = emptyDraftFieldsForActionType(actionType)
	if (draft.mode === 'edit')
		return {
			mode: 'edit',
			...fields,
			selector: draft.selector,
			indexInSequence: draft.indexInSequence,
			createdAt: draft.createdAt,
		}

	return {
		mode: 'create',
		...fields,
	}
}

export const sessionComposerNoticeMessage = (
	notice: SessionComposerNotice
) => {
	switch (notice.status) {
		case 'idle':
			return ''
		case 'preparing':
			return 'Preparing EVM native transfer…'
		case 'info':
		case 'error':
		case 'prepared':
		case 'preparedWithWalletRequest':
		case 'preparationBlocked':
		case 'preparationFailed':
			return notice.message
	}
}

export const sessionComposerWalletRequestId = (
	notice: SessionComposerNotice
) => (
	notice.status === 'preparedWithWalletRequest' ?
		notice.walletRequestId
	:
		undefined
)

export const sessionComposerReadinessCheckIds = (
	notice: SessionComposerNotice
) => (
	notice.status === 'prepared'
	|| notice.status === 'preparedWithWalletRequest'
	|| notice.status === 'preparationBlocked'
	|| notice.status === 'preparationFailed' ?
		notice.readinessCheckIds
	:
		[]
)

export const isSessionComposerPreparing = (
	notice: SessionComposerNotice
) => (
	notice.status === 'preparing'
)

export const beginSessionComposerPreparation = (): Extract<SessionComposerNotice, { status: 'preparing' }> => ({
	status: 'preparing',
})

export const completeSessionComposerPreparation = (
	walletRequestId: string | undefined,
	readinessCheckIds: readonly SessionComposerReadinessCheckId[] = []
): Extract<SessionComposerNotice, { status: 'prepared' | 'preparedWithWalletRequest' }> => (
	walletRequestId == null ?
		{
			status: 'prepared',
			message: 'EVM native transfer preparation succeeded.',
			readinessCheckIds,
		}
	:
		{
			status: 'preparedWithWalletRequest',
			message: 'EVM native transfer preparation succeeded and saved a wallet request.',
			walletRequestId,
			readinessCheckIds,
		}
)

export const blockSessionComposerPreparation = (
	error: string,
	readinessCheckIds: readonly SessionComposerReadinessCheckId[] = []
): Extract<SessionComposerNotice, { status: 'preparationBlocked' }> => ({
	status: 'preparationBlocked',
	message: `EVM native transfer preparation blocked: ${error}`,
	readinessCheckIds,
})

export const failSessionComposerPreparation = (
	error: string,
	readinessCheckIds: readonly SessionComposerReadinessCheckId[] = []
): Extract<SessionComposerNotice, { status: 'preparationFailed' }> => ({
	status: 'preparationFailed',
	message: `EVM native transfer preparation could not be saved: ${error}`,
	readinessCheckIds,
})

export const finishSessionComposerPreparation = (
	preparation: {
		ready: boolean
		error?: string
		walletRequest?: {
			id: string
		}
		readiness?: readonly {
			checkId: string
		}[]
	}
): Exclude<SessionComposerNotice, { status: 'idle' | 'info' | 'error' | 'preparing' }> => {
	const readinessCheckIds = (
		preparation.readiness
			?.map(({ checkId }) => checkId)
		?? []
	)
	return (
		!preparation.ready ?
			blockSessionComposerPreparation(
				preparation.error ?? 'Unknown preparation failure.',
				readinessCheckIds
			)
		: preparation.walletRequest?.id == null || preparation.walletRequest.id === '' ?
			failSessionComposerPreparation(
				'Preparation finished without creating a wallet request.',
				readinessCheckIds
			)
		:
			completeSessionComposerPreparation(
				preparation.walletRequest.id,
				readinessCheckIds
			)
	)
}
