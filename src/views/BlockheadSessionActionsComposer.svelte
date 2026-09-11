<script module lang="ts">
	import {
		parseEntitySelector,
		validateEntitySelector,
	} from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { type as arktype } from 'arktype'
	import { parse } from 'devalue'

	const entityDragPayload = arktype({
		entityType: arktype.enumerated(...Object.values(EntityType)),
		entitySelector: 'object',
	})

	export const sessionTransferSource = (
		entityType: EntityType,
		entitySelector: object
	) => {
		validateEntitySelector(
			schema,
			entityDefinitionByType[entityType],
			entitySelector,
		)
		if (entityType !== EntityType.EvmNetworkAccount)
			return {
				error: 'Only EVM account cards can start transfer drafts.',
			} as const

		const parsedEntitySelector = parseEntitySelector(
			schema,
			entityDefinitionByType[EntityType.EvmNetworkAccount],
			entitySelector,
		)
		if (parsedEntitySelector instanceof arktype.errors)
			throw parsedEntitySelector

		return {
			fromActor: parsedEntitySelector.$actor.address,
			chainId: parsedEntitySelector.$network.caip2.reference,
		} as const
	}

	export const sessionTransferSourceFromSerialized = (serializedPayload: string) => {
		try {
			const payload = entityDragPayload.assert(parse(serializedPayload))
			return sessionTransferSource(payload.entityType, payload.entitySelector)
		} catch {
			return {
				error: 'That drop payload is invalid or expired. Try an account card again.',
			} as const
		}
	}
</script>


<script lang="ts">
	// Types/constants
	import type {
		RegisteredEntityProxyData,
		RegisteredEntityProxyResource,
	} from '$/client/$proxy.svelte.ts'
	import {
		type ActionParamsByActionType,
		ActionType,
		actionTypeDefinitionByActionType,
		actionTypeDefinitions,
	} from '$/actions/index.ts'
	import { entityDragDataType } from '$/components/EntityId.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { Source } from '$/sources/Source.ts'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import {
		beginSessionComposerPreparation,
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
	} from '$/state/sessions/sessionActionsComposerState.ts'


	// Context
	import {
		deleteLocalBlockheadSession,
		deleteLocalBlockheadSessionAction,
		deleteLocalBlockheadSessionLockedAt,
		StaleSessionActionRevisionError,
		updateLocalBlockheadSessionActionType,
		writeLocalBlockheadSessionAction,
		writeLocalBlockheadSessionLockedAt,
		writeLocalBlockheadSessionName,
	} from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		selection,
		id,
		open,
	}: {
		selection: RegisteredEntityProxyResource<EntityType.BlockheadSession>
		id: string
		open: boolean
	} = $props()

	let actionType = $state(
		ActionType.Swap,
	)
	let sessionName = $state('')
	let draft = $state<SessionActionDraft>(idleSessionActionDraft)
	let notice = $state<SessionComposerNotice>(idleSessionComposerNotice)
	let keyboardFromActor = $state('')
	let keyboardChainId = $state('')

	const session = $derived(
		selection({
			sources: [Source.Local_Internal],
			fields: {
				lockedAt: true,
			},
		})
	)
	const sessionActions = $derived(
		selection.$$actions({
			sources: [Source.Local_Internal],
			fields: {
				actionType: true,
				actionParams: true,
				indexInSequence: true,
				createdAt: true,
				contentRevisionHash: true,
			},
		})
	)
	const noticeMessage = $derived(sessionComposerNoticeMessage(notice))
	const preparedWalletRequestId = $derived(sessionComposerWalletRequestId(notice))
	const preparing = $derived(isSessionComposerPreparing(notice))
	const noticeReadinessCheckIds = $derived(sessionComposerReadinessCheckIds(notice))
	// Functions
	import { normalizeBoundaryError } from '$/lib/errors.ts'
	import { applyEvmNativeTransferPreparation } from '$/state/sessions/evmNativeTransferPreparation.ts'
	import { getWalletConnectionRuntime } from '$/state/wallets/walletConnectionRuntime.svelte.ts'

	const cancelDraft = () => {
		draft = idleSessionActionDraft
	}

	const writeAction = async <_ActionType extends ActionType>(
		activeDraft: Extract<Exclude<SessionActionDraft, { mode: 'idle' }>, { actionType: _ActionType }>,
		actionParams: ActionParamsByActionType[_ActionType]
	) => {
		if (activeDraft.mode === 'edit') {
			await updateLocalBlockheadSessionActionType(
				getAppClient(),
				activeDraft.selector,
				selection.entitySelector,
				activeDraft.indexInSequence,
				activeDraft.createdAt,
				activeDraft.actionType,
				actionParams,
				activeDraft.expectedContentRevisionHash,
			)
			notice = {
				status: 'info',
				message: `${activeDraft.actionType} draft updated.`,
			}
		} else {
			await writeLocalBlockheadSessionAction(
				getAppClient(),
				selection.entitySelector,
				activeDraft.actionType,
				actionParams,
			)
			notice = {
				status: 'info',
				message: `${activeDraft.actionType} draft added.`,
			}
		}
		cancelDraft()
	}

	const editAction = (
		resolvedAction: RegisteredEntityProxyData<EntityType.BlockheadSessionAction>
	) => {
		cancelDraft()
		if (resolvedAction.actionParams == null) {
			notice = {
				status: 'error',
				message: 'Draft parameters are not available.',
			}
			return
		}
		if (resolvedAction.contentRevisionHash == null) {
			notice = {
				status: 'error',
				message: 'Draft content revision is not available.',
			}
			return
		}
		const nextActionType = arktype.enumerated(...Object.values(ActionType)).assert(resolvedAction.actionType)
		const identity = {
			selector: resolvedAction[EntityMetaKey.Selector],
			indexInSequence: resolvedAction.indexInSequence,
			createdAt: resolvedAction.createdAt,
			expectedContentRevisionHash: resolvedAction.contentRevisionHash,
		}
		if (nextActionType === ActionType.Transfer) {
			const actionParams = actionTypeDefinitionByActionType[nextActionType].params.assert(resolvedAction.actionParams ?? {})
			draft = editSessionActionDraft(
				{
					actionType: ActionType.Transfer,
					fields: {
						fromActor: actionParams.fromActor,
						toActor: actionParams.toActor,
						chainId: String(actionParams.chainId),
						tokenAddress: actionParams.tokenAddress,
						amount: String(actionParams.amount),
					},
				},
				identity,
			)
		} else if (nextActionType === ActionType.Swap) {
			const actionParams = actionTypeDefinitionByActionType[nextActionType].params.assert(resolvedAction.actionParams ?? {})
			draft = editSessionActionDraft(
				{
					actionType: ActionType.Swap,
					fields: {
						chainId: String(actionParams.chainId),
						tokenIn: actionParams.tokenIn,
						tokenOut: actionParams.tokenOut,
						amount: String(actionParams.amount),
						slippage: String(actionParams.slippage),
					},
				},
				identity,
			)
		} else {
			const actionParams = actionTypeDefinitionByActionType[nextActionType].params.assert(resolvedAction.actionParams ?? {})
			draft = editSessionActionDraft(
				{
					actionType: ActionType.Bridge,
					fields: {
						fromChainId: String(actionParams.fromChainId),
						toChainId: String(actionParams.toChainId),
						tokenAddress: actionParams.tokenAddress,
						amount: String(actionParams.amount),
						slippage: String(actionParams.slippage),
					},
				},
				identity,
			)
		}
		notice = {
			status: 'info',
			message: `${nextActionType} draft loaded.`,
		}
	}

	const confirmDraft = async () => {
		if (draft.mode === 'idle')
			return

		try {
			if (draft.actionType === ActionType.Transfer)
				await writeAction(draft, actionTypeDefinitionByActionType[draft.actionType].params.assert({
					fromActor: draft.fields.fromActor,
					toActor: draft.fields.toActor,
					chainId: Number(draft.fields.chainId),
					tokenAddress: draft.fields.tokenAddress,
					amount: BigInt(draft.fields.amount),
				}))
			else if (draft.actionType === ActionType.Swap)
				await writeAction(draft, actionTypeDefinitionByActionType[draft.actionType].params.assert({
					chainId: Number(draft.fields.chainId),
					tokenIn: draft.fields.tokenIn,
					tokenOut: draft.fields.tokenOut,
					amount: BigInt(draft.fields.amount),
					slippage: Number(draft.fields.slippage),
				}))
			else
				await writeAction(draft, actionTypeDefinitionByActionType[draft.actionType].params.assert({
					fromChainId: Number(draft.fields.fromChainId),
					toChainId: Number(draft.fields.toChainId),
					tokenAddress: draft.fields.tokenAddress,
					amount: BigInt(draft.fields.amount),
					slippage: Number(draft.fields.slippage),
				}))
		} catch (error) {
			notice = {
				status: 'error',
				message: error instanceof StaleSessionActionRevisionError ?
					'Action changed; reload before saving.'
				:
					'Draft values are invalid. Correct them before saving.',
			}
		}
	}

	const writeDraggedEntityAction = (event: DragEvent) => {
		event.preventDefault()
		const serializedPayload = event.dataTransfer?.getData(entityDragDataType)
		if (!serializedPayload) {
			notice = {
				status: 'error',
				message: 'Drop an account card to start a transfer draft.',
			}
			return
		}

		const source = sessionTransferSourceFromSerialized(serializedPayload)
		if ('error' in source) {
			notice = {
				status: 'error',
				message: source.error,
			}
			return
		}

		draft = createSessionActionDraft({
			actionType: ActionType.Transfer,
			fields: {
				fromActor: source.fromActor,
				toActor: '',
				chainId: source.chainId,
				tokenAddress: '',
				amount: '',
			},
		})
		notice = {
			status: 'info',
			message: 'Transfer draft started.',
		}
	}

	// Components
	import BlockheadSessionActionsView from '$/views/BlockheadSessionActionsView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<ResourceBoundary resource={session}>
	{#snippet children(resolvedSession)}
		<div data-column="gap-3">
			<div data-row="start wrap align-center gap-2">
				{#if resolvedSession.lockedAt == null}
					<form
						data-row="start wrap align-center gap-2"
						onsubmit={async (event) => {
							event.preventDefault()
							await writeLocalBlockheadSessionName(
								getAppClient(),
								selection.entitySelector,
								sessionName,
							)
							sessionName = ''
						}}
					>
						<label for={`${id}-session-name`}>Rename session</label>
						<input id={`${id}-session-name`} bind:value={sessionName} required />
						<button type="submit">Rename</button>
					</form>

					<form
						data-row="start wrap align-center gap-2"
						onsubmit={(event) => {
							event.preventDefault()
							draft = createSessionActionDraft(emptyDraftFieldsForActionType(actionType))
							notice = idleSessionComposerNotice
						}}
					>
						<label for={`${id}-action-type`}>Add action</label>

						<select
							id={`${id}-action-type`}
							bind:value={actionType}
						>
							{#each actionTypeDefinitions as definition (definition.type)}
								<option value={definition.type}>{definition.label}</option>
							{/each}
						</select>

						<button type="submit">Add</button>
					</form>

				<button
					type="button"
					onclick={async () => {
						cancelDraft()
						await writeLocalBlockheadSessionLockedAt(
							getAppClient(),
							selection.entitySelector,
							Date.now(),
						)
					}}
				>
					Lock session
				</button>
			{:else}
				<button
					type="button"
					onclick={async () => await deleteLocalBlockheadSessionLockedAt(
						getAppClient(),
						selection.entitySelector,
					)}
				>
					Unlock session
				</button>
			{/if}

			<button
				type="button"
				onclick={async () => {
					await deleteLocalBlockheadSession(
						getAppClient(),
						{ scope: '$$blockheadSessions' },
						selection.entitySelector,
					)
					await goto(resolve('/~/sessions'))
				}}
			>
				Delete session
			</button>
		</div>

		{#if resolvedSession.lockedAt == null}
			<div
				data-card
				role="group"
				aria-label="Entity drop target"
				ondragover={(event) => event.preventDefault()}
				ondrop={writeDraggedEntityAction}
			>
				<p>Drop an EVM network account to start a transfer draft.</p>

				<form
					data-row="start wrap align-end gap-2"
					onsubmit={(event) => {
						event.preventDefault()
						try {
							const source = sessionTransferSource(EntityType.EvmNetworkAccount, {
								$network: {
									caip2: {
										namespace: 'eip155',
										reference: keyboardChainId,
									},
								},
								$actor: {
									address: keyboardFromActor,
								},
							})
							if ('error' in source) {
								notice = {
									status: 'error',
									message: source.error,
								}
								return
							}

							draft = createSessionActionDraft({
								actionType: ActionType.Transfer,
								fields: {
									fromActor: source.fromActor,
									toActor: '',
									chainId: source.chainId,
									tokenAddress: '',
									amount: '',
								},
							})
							notice = {
								status: 'info',
								message: 'Transfer draft started.',
							}
						} catch {
							notice = {
								status: 'error',
								message: 'Choose a valid EVM account and chain ID.',
							}
						}
					}}
				>
					<label for={`${id}-keyboard-from-actor`}>Source account</label>
					<input id={`${id}-keyboard-from-actor`} bind:value={keyboardFromActor} pattern={'0x[0-9a-fA-F]{40}'} required />

					<label for={`${id}-keyboard-chain-id`}>Source chain ID</label>
					<input id={`${id}-keyboard-chain-id`} bind:value={keyboardChainId} inputmode="numeric" pattern="[0-9]+" required />

					<button type="submit">Start transfer draft with keyboard</button>
				</form>
			</div>
		{/if}

		{#if draft.mode !== 'idle' && resolvedSession.lockedAt == null}
			<form
				data-card
				data-column="gap-3"
				onsubmit={(event) => {
					event.preventDefault()
					confirmDraft()
				}}
			>
				<header data-row="between wrap align-center gap-2">
					<strong>{draft.actionType} draft</strong>
					<span data-text="annotation">Complete the required parameters before saving this draft.</span>
				</header>

				<label for={`${id}-draft-action-type`}>Draft action type</label>
				<select
					id={`${id}-draft-action-type`}
					bind:value={
						() => draft.mode === 'idle' ? ActionType.Swap : draft.actionType,
						(_actionType) => {
							if (draft.mode === 'idle')
								return
							draft = retargetSessionActionDraft(draft, _actionType)
						}
					}
				>
					{#each actionTypeDefinitions as definition (definition.type)}
						<option value={definition.type}>{definition.label}</option>
					{/each}
				</select>

				{#if draft.actionType === ActionType.Transfer}
					<label for={`${id}-from-actor`}>From account</label>
					<input
						id={`${id}-from-actor`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Transfer ? draft.fields.fromActor : '',
							(_fromActor) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Transfer)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										fromActor: _fromActor,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>

					<label for={`${id}-to-actor`}>To account</label>
					<input
						id={`${id}-to-actor`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Transfer ? draft.fields.toActor : '',
							(_toActor) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Transfer)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										toActor: _toActor,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>

					<label for={`${id}-chain-id`}>Chain ID</label>
					<input
						id={`${id}-chain-id`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Transfer ? draft.fields.chainId : '',
							(_chainId) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Transfer)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										chainId: _chainId,
									},
								}
							}
						}
						inputmode="numeric"
						pattern="[0-9]+"
						required
					/>

					<label for={`${id}-token-address`}>Token address</label>
					<input
						id={`${id}-token-address`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Transfer ? draft.fields.tokenAddress : '',
							(_tokenAddress) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Transfer)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										tokenAddress: _tokenAddress,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>
				{:else if draft.actionType === ActionType.Swap}
					<label for={`${id}-chain-id`}>Chain ID</label>
					<input
						id={`${id}-chain-id`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Swap ? draft.fields.chainId : '',
							(_chainId) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Swap)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										chainId: _chainId,
									},
								}
							}
						}
						inputmode="numeric"
						pattern="[0-9]+"
						required
					/>

					<label for={`${id}-token-in`}>Token in</label>
					<input
						id={`${id}-token-in`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Swap ? draft.fields.tokenIn : '',
							(_tokenIn) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Swap)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										tokenIn: _tokenIn,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>

					<label for={`${id}-token-out`}>Token out</label>
					<input
						id={`${id}-token-out`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Swap ? draft.fields.tokenOut : '',
							(_tokenOut) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Swap)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										tokenOut: _tokenOut,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>
				{:else}
					<label for={`${id}-from-chain-id`}>From chain ID</label>
					<input
						id={`${id}-from-chain-id`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Bridge ? draft.fields.fromChainId : '',
							(_fromChainId) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Bridge)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										fromChainId: _fromChainId,
									},
								}
							}
						}
						inputmode="numeric"
						pattern="[0-9]+"
						required
					/>

					<label for={`${id}-to-chain-id`}>To chain ID</label>
					<input
						id={`${id}-to-chain-id`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Bridge ? draft.fields.toChainId : '',
							(_toChainId) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Bridge)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										toChainId: _toChainId,
									},
								}
							}
						}
						inputmode="numeric"
						pattern="[0-9]+"
						required
					/>

					<label for={`${id}-token-address`}>Token address</label>
					<input
						id={`${id}-token-address`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType === ActionType.Bridge ? draft.fields.tokenAddress : '',
							(_tokenAddress) => {
								if (draft.mode === 'idle' || draft.actionType !== ActionType.Bridge)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										tokenAddress: _tokenAddress,
									},
								}
							}
						}
						pattern={'0x[0-9a-fA-F]{40}'}
						required
					/>
				{/if}

				<label for={`${id}-amount`}>Amount (base units)</label>
				<input
					id={`${id}-amount`}
					bind:value={
						() => draft.mode === 'idle' ? '' : draft.fields.amount,
						(_amount) => {
							if (draft.mode === 'idle')
								return
							draft = {
								...draft,
								fields: {
									...draft.fields,
									amount: _amount,
								},
							}
						}
					}
					inputmode="numeric"
					pattern="[0-9]+"
					required
				/>

				{#if draft.actionType !== ActionType.Transfer}
					<label for={`${id}-slippage`}>Slippage</label>
					<input
						id={`${id}-slippage`}
						bind:value={
							() => draft.mode !== 'idle' && draft.actionType !== ActionType.Transfer ? draft.fields.slippage : '0.005',
							(_slippage) => {
								if (draft.mode === 'idle' || draft.actionType === ActionType.Transfer)
									return
								draft = {
									...draft,
									fields: {
										...draft.fields,
										slippage: _slippage,
									},
								}
							}
						}
						type="number"
						min="0"
						step="any"
						required
					/>
				{/if}

				<div data-row="start wrap gap-2">
					<button type="submit">Confirm draft</button>
					<button type="button" onclick={cancelDraft}>Cancel</button>
				</div>
			</form>
		{/if}

		{#if notice.status !== 'idle'}
			<p role="status">
				{noticeMessage}
				{#if preparedWalletRequestId != null}
					<a
						href={resolve(
							'/~/wallets/requests/[id=stringSegment]',
							{
								id: preparedWalletRequestId,
							}
						)}
					>
						Open wallet request
					</a>
				{/if}
			</p>
			{#if noticeReadinessCheckIds.length > 0}
				<ul>
					{#each noticeReadinessCheckIds as checkId (checkId)}
						<li>{checkId}</li>
					{/each}
				</ul>
			{/if}
		{/if}

		<BlockheadSessionActionsView
			selection={selection.$$actions}
			CollapsibleProps={{ canToggle: false }}
			collapsible={false}
			emptyText="No actions."
			{open}
			title="Actions"
			id={`${id}-list`}
		/>

		<ResourceBoundary resource={sessionActions}>
			{#snippet children(resolvedActions)}
				{#if resolvedSession.lockedAt == null}
					{#if resolvedActions.values.length > 0}
						<div data-column="gap-2">
							{#each resolvedActions.values as resolvedAction (resolvedAction[EntityMetaKey.SelectorKey])}
								<article data-card data-row="between wrap align-center gap-2">
									<button
										type="button"
										onclick={() => editAction(resolvedAction)}
									>
										Edit {resolvedAction.actionType} action
									</button>

									<button
										type="button"
										onclick={() => void deleteLocalBlockheadSessionAction(
											getAppClient(),
											selection.entitySelector,
											resolvedAction[EntityMetaKey.Selector],
										)}
									>
										Delete {resolvedAction.actionType} action
									</button>
								</article>
							{/each}
						</div>
					{/if}
				{:else}
					<button
						type="button"
						disabled={preparing}
						onclick={async () => {
							notice = beginSessionComposerPreparation()
							try {
								notice = finishSessionComposerPreparation(
									await applyEvmNativeTransferPreparation({
										context: getAppClient(),
										session: {
											id: selection.entitySelector.id,
											lockedAt: resolvedSession.lockedAt,
										},
										actions: resolvedActions.values.map((resolvedAction) => ({
											sessionId: resolvedAction[EntityMetaKey.Selector].sessionId,
											actionId: resolvedAction[EntityMetaKey.Selector].actionId,
											indexInSequence: resolvedAction.indexInSequence,
											actionType: arktype.enumerated(...Object.values(ActionType)).assert(resolvedAction.actionType),
											actionParams: resolvedAction.actionParams,
										})),
										walletConnections: getWalletConnectionRuntime()?.connections ?? [],
									})
								)
							}
							catch (error) {
								notice = failSessionComposerPreparation(normalizeBoundaryError(error).message)
							}
						}}
					>
						{preparing ? 'Preparing EVM native transfer…' : 'Prepare EVM native transfer'}
					</button>

					{#if noticeReadinessCheckIds.length === 0}
						{#each resolvedActions.values as resolvedAction (resolvedAction[EntityMetaKey.SelectorKey])}
							<ResourceBoundary
								resource={
									select(
										EntityType.BlockheadSessionAction,
										resolvedAction[EntityMetaKey.Selector],
									).$$readinessChecks({
										sources: [Source.Local_Internal],
										fields: {
											checkKind: true,
											capabilityKey: true,
										},
									})
								}
							>
								{#snippet children(readinessChecks)}
									{#if readinessChecks.values.length > 0}
										<ul>
											{#each readinessChecks.values as readinessCheck (readinessCheck[EntityMetaKey.SelectorKey])}
												<li>{readinessCheck[EntityMetaKey.Selector].checkId}</li>
											{/each}
										</ul>
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/each}
					{/if}
				{/if}
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}
</ResourceBoundary>
