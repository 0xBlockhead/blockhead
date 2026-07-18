<script lang="ts">
	// Types/constants
	import type { RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import {
		ActionType,
		actionTypeDefinitionByActionType,
		actionTypeDefinitions,
	} from '$/constants/actions.ts'
	import { entityDragDataType } from '$/components/EntityId.svelte'
	import { EntityMetaKey, parseEntitySelector, validateEntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { type as arktype } from 'arktype'
	import { parse } from 'devalue'

	const entityDragPayload = arktype({
		entityType: arktype.enumerated(...Object.values(EntityType)),
		entitySelector: 'object',
	})


	// Context
	import {
		deleteLocalBlockheadSession,
		deleteLocalBlockheadSessionAction,
		deleteLocalBlockheadSessionLockedAt,
		updateLocalBlockheadSessionActionType,
		writeLocalBlockheadSessionAction,
		writeLocalBlockheadSessionLockedAt,
		writeLocalBlockheadSessionName,
	} from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/+layout.svelte'


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
	let draftActionType = $state<ActionType>()
	let fromActor = $state('')
	let toActor = $state('')
	let chainId = $state('')
	let tokenAddress = $state('')
	let tokenIn = $state('')
	let tokenOut = $state('')
	let fromChainId = $state('')
	let toChainId = $state('')
	let amount = $state('')
	let slippage = $state('0.005')
	let status = $state('')

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
				indexInSequence: true,
				createdAt: true,
			},
		})
	)


	// Functions
	const cancelDraft = () => {
		draftActionType = undefined
		fromActor = ''
		toActor = ''
		chainId = ''
		tokenAddress = ''
		tokenIn = ''
		tokenOut = ''
		fromChainId = ''
		toChainId = ''
		amount = ''
		slippage = '0.005'
	}

	const writeAction = (confirmedActionType: ActionType, actionParams: object) => {
		writeLocalBlockheadSessionAction(
			getAppClient(),
			selection.entitySelector,
			Date.now(),
			confirmedActionType,
			actionParams,
		)
		status = `${confirmedActionType} draft added.`
		cancelDraft()
	}

	const confirmDraft = () => {
		try {
			if (draftActionType === ActionType.Transfer)
				writeAction(draftActionType, actionTypeDefinitionByActionType[draftActionType].params.assert({
					fromActor,
					toActor,
					chainId: Number(chainId),
					tokenAddress,
					amount: BigInt(amount),
				}))
			else if (draftActionType === ActionType.Swap)
				writeAction(draftActionType, actionTypeDefinitionByActionType[draftActionType].params.assert({
					chainId: Number(chainId),
					tokenIn,
					tokenOut,
					amount: BigInt(amount),
					slippage: Number(slippage),
				}))
			else if (draftActionType === ActionType.Bridge)
				writeAction(draftActionType, actionTypeDefinitionByActionType[draftActionType].params.assert({
					fromChainId: Number(fromChainId),
					toChainId: Number(toChainId),
					tokenAddress,
					amount: BigInt(amount),
					slippage: Number(slippage),
				}))
		} catch {
			status = 'Draft values are invalid. Correct them before saving.'
		}
	}

	const writeDraggedEntityAction = (event: DragEvent) => {
		event.preventDefault()
		const serializedPayload = event.dataTransfer?.getData(entityDragDataType)
		if (!serializedPayload) {
			status = 'Drop an account card to start a transfer draft.'
			return
		}

		try {
			const payload = entityDragPayload.assert(parse(serializedPayload))
			validateEntitySelector(
				schema,
				entityDefinitionByType[payload.entityType],
				payload.entitySelector,
			)
			if (payload.entityType !== EntityType.EvmNetworkAccount) {
				status = 'Only EVM account cards can start transfer drafts.'
				return
			}

			const entitySelector = parseEntitySelector(
				schema,
				entityDefinitionByType[EntityType.EvmNetworkAccount],
				payload.entitySelector,
			)
			if (entitySelector instanceof arktype.errors)
				throw entitySelector

			draftActionType = ActionType.Transfer
			fromActor = entitySelector.$actor.address
			chainId = entitySelector.$network.caip2.reference
			toActor = ''
			tokenAddress = ''
			amount = ''
			status = 'Transfer draft started.'
		} catch {
			status = 'That drop payload is invalid or expired. Try an account card again.'
			return
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
							onsubmit={(event) => {
								event.preventDefault()
								writeLocalBlockheadSessionName(
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
							draftActionType = actionType
							status = ''
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
						onclick={() => writeLocalBlockheadSessionLockedAt(
							getAppClient(),
							selection.entitySelector,
							Date.now(),
						)}
					>
						Lock session
					</button>
				{:else}
					<button
						type="button"
						onclick={() => deleteLocalBlockheadSessionLockedAt(
							getAppClient(),
							selection.entitySelector,
						)}
					>
						Unlock session
					</button>
				{/if}

				<button
					type="button"
					onclick={() => deleteLocalBlockheadSession(
						getAppClient(),
						{ scope: '$$blockheadSessions' },
						selection.entitySelector,
					)}
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

					<button
						type="button"
						onclick={() => {
							draftActionType = ActionType.Transfer
							status = ''
						}}
					>
						Start transfer draft with keyboard
					</button>
				</div>
			{/if}

			{#if draftActionType !== undefined}
				<form
					data-card
					data-column="gap-3"
					onsubmit={(event) => {
						event.preventDefault()
						confirmDraft()
					}}
				>
					<header data-row="between wrap align-center gap-2">
						<strong>{draftActionType} draft</strong>
						<span data-text="annotation">Complete the required parameters before adding this draft.</span>
					</header>

					{#if draftActionType === ActionType.Transfer}
						<label for={`${id}-from-actor`}>From account</label>
						<input id={`${id}-from-actor`} bind:value={fromActor} pattern="0x[0-9a-fA-F]{40}" required />

						<label for={`${id}-to-actor`}>To account</label>
						<input id={`${id}-to-actor`} bind:value={toActor} pattern="0x[0-9a-fA-F]{40}" required />

						<label for={`${id}-chain-id`}>Chain ID</label>
						<input id={`${id}-chain-id`} bind:value={chainId} inputmode="numeric" pattern="[0-9]+" required />

						<label for={`${id}-token-address`}>Token address</label>
						<input id={`${id}-token-address`} bind:value={tokenAddress} pattern="0x[0-9a-fA-F]{40}" required />
					{:else if draftActionType === ActionType.Swap}
						<label for={`${id}-chain-id`}>Chain ID</label>
						<input id={`${id}-chain-id`} bind:value={chainId} inputmode="numeric" pattern="[0-9]+" required />

						<label for={`${id}-token-in`}>Token in</label>
						<input id={`${id}-token-in`} bind:value={tokenIn} pattern="0x[0-9a-fA-F]{40}" required />

						<label for={`${id}-token-out`}>Token out</label>
						<input id={`${id}-token-out`} bind:value={tokenOut} pattern="0x[0-9a-fA-F]{40}" required />
					{:else}
						<label for={`${id}-from-chain-id`}>From chain ID</label>
						<input id={`${id}-from-chain-id`} bind:value={fromChainId} inputmode="numeric" pattern="[0-9]+" required />

						<label for={`${id}-to-chain-id`}>To chain ID</label>
						<input id={`${id}-to-chain-id`} bind:value={toChainId} inputmode="numeric" pattern="[0-9]+" required />

						<label for={`${id}-token-address`}>Token address</label>
						<input id={`${id}-token-address`} bind:value={tokenAddress} pattern="0x[0-9a-fA-F]{40}" required />
					{/if}

					<label for={`${id}-amount`}>Amount (base units)</label>
					<input id={`${id}-amount`} bind:value={amount} inputmode="numeric" pattern="[0-9]+" required />

					{#if draftActionType !== ActionType.Transfer}
						<label for={`${id}-slippage`}>Slippage</label>
						<input id={`${id}-slippage`} bind:value={slippage} type="number" min="0" step="any" required />
					{/if}

					<div data-row="start wrap gap-2">
						<button type="submit">Confirm draft</button>
						<button type="button" onclick={cancelDraft}>Cancel</button>
					</div>
				</form>
			{/if}

			{#if status !== ''}
				<p role="status">{status}</p>
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

			{#if resolvedSession.lockedAt == null}
				<ResourceBoundary resource={sessionActions}>
					{#snippet children(resolvedActions)}
						{#if resolvedActions.values.length > 0}
							<div data-column="gap-2">
								{#each resolvedActions.values as resolvedAction (resolvedAction[EntityMetaKey.SelectorKey])}
									<article data-card data-row="between wrap align-center gap-2">
										<form
											data-row="start wrap align-center gap-2"
											onsubmit={(event) => {
												event.preventDefault()
												updateLocalBlockheadSessionActionType(
													getAppClient(),
													resolvedAction[EntityMetaKey.Selector],
													selection.entitySelector,
													resolvedAction.indexInSequence,
													resolvedAction.createdAt,
													arktype.enumerated(...Object.values(ActionType)).assert(
														new FormData(event.currentTarget).get('actionType')
													),
												)
											}}
										>
											<label for={`${id}-${resolvedAction[EntityMetaKey.Selector].actionId}-action-type`}>
												Edit {resolvedAction.actionType} action
											</label>
											<select
												id={`${id}-${resolvedAction[EntityMetaKey.Selector].actionId}-action-type`}
												name="actionType"
												value={resolvedAction.actionType}
											>
												{#each actionTypeDefinitions as definition (definition.type)}
													<option value={definition.type}>{definition.label}</option>
												{/each}
											</select>
											<button type="submit">Save action type</button>
										</form>

										<button
											type="button"
											onclick={() => deleteLocalBlockheadSessionAction(
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
					{/snippet}
				</ResourceBoundary>
			{/if}
		</div>
	{/snippet}
</ResourceBoundary>
