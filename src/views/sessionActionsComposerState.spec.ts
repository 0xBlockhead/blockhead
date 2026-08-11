import { describe, expect, it } from 'vitest'

import { ActionType } from '$/constants/actions.ts'
import {
	beginSessionComposerPreparation,
	blockSessionComposerPreparation,
	completeSessionComposerPreparation,
	createSessionActionDraft,
	editSessionActionDraft,
	emptyDraftFieldsForActionType,
	failSessionComposerPreparation,
	finishSessionComposerPreparation,
	idleSessionActionDraft,
	idleSessionComposerNotice,
	isSessionComposerPreparing,
	retargetSessionActionDraft,
	sessionComposerNoticeMessage,
	sessionComposerReadinessCheckIds,
	sessionComposerWalletRequestId,
	type SessionActionDraft,
	type SessionComposerNotice,
} from './sessionActionsComposerState.ts'


describe('sessionActionsComposerState', () => {
	it('keeps create drafts free of edit identity fields', () => {
		const draft = createSessionActionDraft(emptyDraftFieldsForActionType(ActionType.Transfer))
		expect(draft).toEqual({
			mode: 'create',
			actionType: ActionType.Transfer,
			fields: {
				fromActor: '',
				toActor: '',
				chainId: '',
				tokenAddress: '',
				amount: '',
			},
		})
		expect(draft).not.toHaveProperty('selector')
		expect(draft).not.toHaveProperty('indexInSequence')
		expect(draft).not.toHaveProperty('createdAt')
	})

	it('requires edit identity when mode is edit', () => {
		const draft = editSessionActionDraft(
			{
				actionType: ActionType.Swap,
				fields: {
					chainId: '1',
					tokenIn: '0x0000000000000000000000000000000000000001',
					tokenOut: '0x0000000000000000000000000000000000000002',
					amount: '1',
					slippage: '0.005',
				},
			},
			{
				selector: {
					sessionId: 'session-1',
					actionId: 'action-1',
				},
				indexInSequence: 0,
				createdAt: 10,
			}
		)
		expect(draft.mode).toBe('edit')
		expect(draft.selector).toEqual({
			sessionId: 'session-1',
			actionId: 'action-1',
		})
		expect(draft.indexInSequence).toBe(0)
		expect(draft.createdAt).toBe(10)
	})

	it('retargets action type while preserving edit identity and clearing mismatched fields', () => {
		const draft = retargetSessionActionDraft(
			editSessionActionDraft(
				{
					actionType: ActionType.Transfer,
					fields: {
						fromActor: '0x1111111111111111111111111111111111111111',
						toActor: '0x2222222222222222222222222222222222222222',
						chainId: '1',
						tokenAddress: '0x0000000000000000000000000000000000000000',
						amount: '3',
					},
				},
				{
					selector: {
						sessionId: 'session-1',
						actionId: 'action-1',
					},
					indexInSequence: 2,
					createdAt: 99,
				}
			),
			ActionType.Bridge
		)
		expect(draft).toEqual({
			mode: 'edit',
			actionType: ActionType.Bridge,
			fields: {
				fromChainId: '',
				toChainId: '',
				tokenAddress: '',
				amount: '',
				slippage: '0.005',
			},
			selector: {
				sessionId: 'session-1',
				actionId: 'action-1',
			},
			indexInSequence: 2,
			createdAt: 99,
		})
	})

	it('makes preparing exclusive of wallet-request and message payloads', () => {
		const notice = beginSessionComposerPreparation()
		expect(notice).toEqual({ status: 'preparing' })
		expect(isSessionComposerPreparing(notice)).toBe(true)
		expect(sessionComposerWalletRequestId(notice)).toBeUndefined()
		expect(sessionComposerNoticeMessage(notice)).toBe('Preparing EVM native transfer…')
		expect(notice).not.toHaveProperty('walletRequestId')
		expect(notice).not.toHaveProperty('message')
	})

	it('attaches walletRequestId only on preparedWithWalletRequest', () => {
		const withoutRequest = completeSessionComposerPreparation(undefined)
		const withRequest = completeSessionComposerPreparation('evm-native-transfer:s:a:h', ['wallet-account'])
		expect(withoutRequest).toEqual({
			status: 'prepared',
			message: 'EVM native transfer preparation succeeded.',
			readinessCheckIds: [],
		})
		expect(sessionComposerWalletRequestId(withoutRequest)).toBeUndefined()
		expect(withRequest).toEqual({
			status: 'preparedWithWalletRequest',
			message: 'EVM native transfer preparation succeeded and saved a wallet request.',
			walletRequestId: 'evm-native-transfer:s:a:h',
			readinessCheckIds: ['wallet-account'],
		})
		expect(sessionComposerWalletRequestId(withRequest)).toBe('evm-native-transfer:s:a:h')
	})

	it('keeps blocked and failed preparation distinct from prepared success', () => {
		const blocked = blockSessionComposerPreparation('missing wallet', ['wallet-account'])
		const failed = failSessionComposerPreparation('disk full')
		expect(blocked.status).toBe('preparationBlocked')
		expect(failed.status).toBe('preparationFailed')
		expect(sessionComposerWalletRequestId(blocked)).toBeUndefined()
		expect(sessionComposerWalletRequestId(failed)).toBeUndefined()
		expect(isSessionComposerPreparing(blocked)).toBe(false)
		expect(sessionComposerReadinessCheckIds(blocked)).toEqual(['wallet-account'])
		expect(sessionComposerReadinessCheckIds(failed)).toEqual([])
	})

	it('finishes only with an explicit wallet request id on the success path', () => {
		expect(finishSessionComposerPreparation({
			ready: false,
			error: 'missing wallet',
			readiness: [
				{
					checkId: 'wallet-account',
				},
			],
		})).toEqual(blockSessionComposerPreparation('missing wallet', ['wallet-account']))
		expect(finishSessionComposerPreparation({
			ready: true,
		})).toEqual(failSessionComposerPreparation('Preparation finished without creating a wallet request.'))
		expect(finishSessionComposerPreparation({
			ready: true,
			walletRequest: {
				id: '',
			},
		})).toEqual(failSessionComposerPreparation('Preparation finished without creating a wallet request.'))
		expect(finishSessionComposerPreparation({
			ready: true,
			walletRequest: {
				id: 'evm-native-transfer:s:a:h',
			},
			readiness: [
				{
					checkId: 'session-locked',
				},
				{
					checkId: 'wallet-account',
				},
			],
		})).toEqual(completeSessionComposerPreparation('evm-native-transfer:s:a:h', [
			'session-locked',
			'wallet-account',
		]))
		expect(finishSessionComposerPreparation({
			ready: false,
			error: 'The single transfer action must be first in the session sequence.',
		})).toEqual({
			status: 'preparationBlocked',
			message: 'EVM native transfer preparation blocked: The single transfer action must be first in the session sequence.',
			readinessCheckIds: [],
		})
		expect(sessionComposerNoticeMessage(finishSessionComposerPreparation({
			ready: true,
			walletRequest: {
				id: 'evm-native-transfer:s:a:h',
			},
		}))).toBe('EVM native transfer preparation succeeded and saved a wallet request.')
	})

	it('rejects constructing illegal notice and draft combos at the type level', () => {
		const illegalNotice: SessionComposerNotice = idleSessionComposerNotice
		const illegalDraft: SessionActionDraft = idleSessionActionDraft

		// @ts-expect-error preparing cannot carry a wallet request id
		const _preparingWithRequest: SessionComposerNotice = {
			status: 'preparing',
			walletRequestId: 'x',
		}
		// @ts-expect-error prepared cannot carry a wallet request id
		const _preparedWithRequest: SessionComposerNotice = {
			status: 'prepared',
			message: 'ok',
			walletRequestId: 'x',
		}
		// @ts-expect-error create drafts cannot carry edit identity
		const _createWithSelector: SessionActionDraft = {
			mode: 'create',
			actionType: ActionType.Transfer,
			fields: {
				fromActor: '',
				toActor: '',
				chainId: '',
				tokenAddress: '',
				amount: '',
			},
			selector: {
				sessionId: 's',
				actionId: 'a',
			},
		}
		// @ts-expect-error edit drafts require identity fields
		const _editWithoutIdentity: SessionActionDraft = {
			mode: 'edit',
			actionType: ActionType.Transfer,
			fields: {
				fromActor: '',
				toActor: '',
				chainId: '',
				tokenAddress: '',
				amount: '',
			},
		}
		// @ts-expect-error transfer fields cannot include swap-only keys
		const _transferWithTokenIn: SessionActionDraft = {
			mode: 'create',
			actionType: ActionType.Transfer,
			fields: {
				fromActor: '',
				toActor: '',
				chainId: '',
				tokenAddress: '',
				amount: '',
				tokenIn: '',
			},
		}

		expect(illegalNotice.status).toBe('idle')
		expect(illegalDraft.mode).toBe('idle')
		void _preparingWithRequest
		void _preparedWithRequest
		void _createWithSelector
		void _editWithoutIdentity
		void _transferWithTokenIn
	})
})
