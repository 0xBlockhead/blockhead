<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ActionType, actionTypeDefinitionByActionType, actionTypeDefinitions } from '$/constants/actions.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { updateLocalBlockheadSessionActionType } from '$/collections/$localMutations.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadSessionAction>
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const sessionAction = $derived(
		useEntity(
			EntityType.BlockheadSessionAction,
			entityId,
			{
				$: [
					Source.Local_Internal,
				],
				indexInSequence: {},
				action: {},
				createdAt: {},
				updatedAt: {},
			},
		),
	)


	// Actions
	const actionTypeFromValue = (value: string) => (
		actionTypeDefinitions.find((definition) => definition.type === value)?.type ?? ActionType.Swap
	)

	const updateActionType = (
		sessionAction: Entity<typeof schema, EntityType.BlockheadSessionAction>,
		actionType: ActionType,
	) => {
		updateLocalBlockheadSessionActionType(
			entityId,
			sessionAction,
			actionType,
		)
	}


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionAction}
	{entityId}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>{entityId.actionId}</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={sessionAction}
			placeholderText="Loading action…"
		>
			{#snippet children(sessionAction)}
				{actionTypeDefinitionByActionType[sessionAction.action.type].icon}
				{' '}
				{actionTypeDefinitionByActionType[sessionAction.action.type].label}
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
							<select
								value={sessionAction.action.type}
								onchange={(event) => {
									updateActionType(
										sessionAction,
										actionTypeFromValue(event.currentTarget.value),
									)
								}}
							>
								{#each actionTypeDefinitions as definition}
									<option value={definition.type}>
										{definition.label}
									</option>
								{/each}
							</select>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
