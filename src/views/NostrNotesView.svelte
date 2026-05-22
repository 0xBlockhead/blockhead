<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Notes',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrNote>
			href: string
			id: string
			limit?: number
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrNote}
	{href}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{collapsible}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-1 text notes are signed events; each event id is a 64-character lowercase hex hash of the full signed payload.
		</p>
		<p>
			Lists resolve through NostrBand and Primal HTTP indexers, scoped to the network hub, profile, or parent note <code>$$replies</code> field you navigated from.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						{
							$: [Source.Constants_Internal],
							[fieldName]: {
								$: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							},
						}
					: entityFieldReference.entityType === EntityType.NostrProfile ?
						{
							$: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							[fieldName]: {
								$: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							},
						}
					:
						{
							$: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							[fieldName]: {
								$: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							},
						}
				),
			)}
			{@const notes = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.NostrNote>[] = (
						parent[fieldName] ?? []
					)
					return rows.slice(0, limit)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrNote}
				id={`${id}-items`}
				{href}
				{title}
				getKey={(row) => row[EntityMetaKey.Id].eventId}
				getSortValue={(row) => (
					`${String(-(row.createdAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Id].eventId}`
				)}
				placeholderKeys={new SvelteSet()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={notes}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No notes yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<NostrNoteView
							entityId={{ eventId: props.item[EntityMetaKey.Id].eventId }}
							href={resolve('/nostr/note/[eventId]', {
								eventId: props.item[EntityMetaKey.Id].eventId,
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
