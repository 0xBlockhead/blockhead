<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityMetaKey, type EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ActionType, actionTypeDefinitionByActionType, actionTypeDefinitions } from '$/constants/actions.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { updateLocalBlockheadSessionActionType } from '$/collections/localMutations.ts'
	import { appClient } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionAction>
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const sessionAction = $derived(
		selection(
			({ sources: [
					Source.Local_Internal,
				], fields: { $session: true, indexInSequence: true, action: true, createdAt: true, updatedAt: true } }),
		),
	)


	// Actions
	const actionTypeFromValue = (value: string) => (
		actionTypeDefinitions.find((definition) => definition.type === value)?.type ?? ActionType.Swap
	)

	const updateActionType = (
		sessionSelector: EntitySelector<typeof schema, EntityType.BlockheadSession>,
		indexInSequence: number,
		createdAt: number,
		actionType: ActionType,
	) => {
		updateLocalBlockheadSessionActionType(
			appClient,
			selection.entitySelector,
			sessionSelector,
			indexInSequence,
			createdAt,
			actionType,
		)
	}


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionAction}
	entitySelector={selection.entitySelector}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>{selection.entitySelector.actionId}</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={sessionAction}
			placeholderText="Loading action…"
		>
			{#snippet children(sessionAction)}
					{#if sessionAction.action !== undefined}
						{actionTypeDefinitionByActionType[sessionAction.action.type].icon}
						{' ' /* gap between icon and label */}
						{actionTypeDefinitionByActionType[sessionAction.action.type].label}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl>
			<div>
				<dt>Index</dt>
				<dd>
					<ResourceBoundary
						resource={sessionAction}
						placeholderText="Loading action…"
					>
						{#snippet children(sessionAction)}
							{String(sessionAction.indexInSequence)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={sessionAction}
						placeholderText="Loading action…"
					>
						{#snippet children(sessionAction)}
							{#if sessionAction.action !== undefined && sessionAction.$session !== undefined && sessionAction.indexInSequence !== undefined && sessionAction.createdAt !== undefined}
								{@const sessionSelector = sessionAction.$session[EntityMetaKey.Selector]}
								{@const indexInSequence = sessionAction.indexInSequence}
								{@const createdAt = sessionAction.createdAt}
								<select
									value={sessionAction.action.type}
									onchange={(event) => {
										updateActionType(
											sessionSelector,
											indexInSequence,
											createdAt,
											actionTypeFromValue(event.currentTarget.value),
										)
									}}
									>
										{#each actionTypeDefinitions as definition (definition.type)}
											<option value={definition.type}>
											{definition.label}
										</option>
									{/each}
								</select>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
