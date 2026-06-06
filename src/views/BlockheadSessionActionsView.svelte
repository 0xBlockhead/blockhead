<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ActionType, actionTypeDefinitions } from '$/constants/actions.ts'
	import { createAction } from '$/lib/createAction.ts'
	import { entityFieldCollectionItemKey } from '$/collections/$collections.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


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
	const sessionId = () => (
		entityFieldReference.entityId.id
	)

	const actionEntityId = (actionId: string) => ({
		sessionId: sessionId(),
		actionId,
	})

	const writeSessionActionReference = (entityId: ReturnType<typeof actionEntityId>) => {
		const value = {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		}
		entityFieldCollections[EntityType.BlockheadSession].$$actions.utils.writeUpsert({
			[EntityMetaKey.ParentId]: entityFieldReference.entityId,
			[EntityMetaKey.ParentIdKey]: stringify(entityFieldReference.entityId),
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: value,
		})
	}

	const writeSessionAction = (indexInSequence: number) => {
		const now = Date.now()
		const entityId = actionEntityId(`${now}`)
		const fields = {
			$session: {
				[EntityMetaKey.Id]: entityFieldReference.entityId,
			},
			indexInSequence,
			action: createAction(actionType),
			createdAt: now,
			updatedAt: now,
		}
		entityCollectionByEntityType[EntityType.BlockheadSessionAction].utils.writeUpsert({
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Fields]: fields,
			...fields,
		})
		writeSessionActionReference(entityId)
	}

	const deleteSessionAction = (entityId: ReturnType<typeof actionEntityId>) => {
		const value = {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		}
		entityFieldCollections[EntityType.BlockheadSession].$$actions.delete(entityFieldCollectionItemKey({
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.ParentIdKey]: stringify(entityFieldReference.entityId),
			[EntityMetaKey.Value]: value,
		}))
		entityCollectionByEntityType[EntityType.BlockheadSessionAction].delete([
			Source.Local_Internal,
			stringify(entityId),
		].join('\x1E'))
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
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Local_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const actions = derive(
				parent,
				(parent) => {
					const blockheadSessionActions: Entity<typeof schema, EntityType.BlockheadSessionAction>[] = (
						parent[entityFieldReference.fieldName] ?? []
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
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
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
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>

					<button
						type="button"
						onclick={() => deleteSessionAction(envelope.value[EntityMetaKey.Id])}
					>
						Remove
					</button>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
