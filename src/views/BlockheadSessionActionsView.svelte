<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ActionType, actionTypeDefinitions } from '$/constants/actions.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import {
		deleteLocalBlockheadSessionAction,
		writeLocalBlockheadSessionAction,
	} from '$/collections/localMutations.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { appClient, subscribe } from '$/routes/+layout.svelte'


	// State
	let {
		entityFieldReference,
		title = 'Actions',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSessionAction
			>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	let actionType = $state<ActionType>(
		ActionType.Swap,
	)


	// Actions
	const writeSessionAction = (indexInSequence: number) => {
		writeLocalBlockheadSessionAction(
			appClient,
			entityFieldReference.selector,
			indexInSequence,
			actionType,
		)
	}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadSessionAction}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No actions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ sources: [
						Source.Local_Internal,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Local_Internal,
						],
					},
				} }),
			)}
			{@const actions = derive(
				parent,
				(parent) => {
					const blockheadSessionActions: readonly Entity<typeof schema, EntityType.BlockheadSessionAction>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						blockheadSessionActions
							.toSorted((left, right) => (left.indexInSequence ?? 0) - (right.indexInSequence ?? 0))
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<form
				data-row="align-center"
				onsubmit={(event) => {
					event.preventDefault()
					writeSessionAction(Date.now())
				}}
			>
				<label for={`${id}-action-type`}>
					Add action
				</label>

				<select
					id={`${id}-action-type`}
					bind:value={actionType}
				>
					{#each actionTypeDefinitions as definition}
						<option value={definition.type}>
							{definition.label}
						</option>
					{/each}
				</select>

				<button type="submit">
					Add
				</button>
			</form>

			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadSessionAction}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Selector])}
				getSortValue={(envelope) => String(envelope.value.indexInSequence ?? 0)}
				resource={actions}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No actions yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<BlockheadSessionActionView
						selector={envelope.value[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>

					<button
						type="button"
						onclick={() => deleteLocalBlockheadSessionAction(
							appClient,
							entityFieldReference.selector,
							envelope.value[EntityMetaKey.Selector],
						)}
					>
						Remove
					</button>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
