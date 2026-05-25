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
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		fieldOpen = true,
		title = 'Notes',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrNote>
			id: string
			limit?: number
			open?: boolean
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrNote}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-1 text notes are signed events; each event id is a 64-character lowercase hex hash of the full signed payload.
		</p>
		<p>
			Lists resolve through NostrBand and Primal HTTP indexers, scoped to the network hub, profile, or parent note <code>$$replies</code> field you navigated from.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						(
							fieldOpen ?
								{
									$: [Source.Constants_Internal],
									$$nostrNotes: {
										$: [Source.NostrBand_Rest],
									},
									$$nostrProfiles: {
										$: [
											Source.Constants_Internal,
											Source.NostrBand_Rest,
											Source.Primal_Rest,
										],
										$$notes: {
											$: [
												Source.NostrBand_Rest,
												Source.Primal_Rest,
											],
										},
									},
								}
							:
								{
									$: [Source.Constants_Internal],
								}
						)
					: entityFieldReference.entityType === EntityType.NostrProfile ?
						{
							$: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							[entityFieldReference.fieldName]: {
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
							[entityFieldReference.fieldName]: {
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
						entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent.$$nostrNotes ?? []),
								...(parent.$$nostrProfiles ?? [])
									.flatMap((profile) => profile.$$notes ?? []),
							]
						:
							(parent[entityFieldReference.fieldName] ?? [])
					)
					return rows.slice(0, limit)
				},
			)}
			{#key `${stringify(entityFieldReference.entityId)}-${limit}-${fieldOpen}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.NostrNote}
					id={`${id}-items`}
					{title}
					getKey={(row) => row[EntityMetaKey.Id].eventId}
					getSortValue={(row) => (
						`${String(-(row.createdAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Id].eventId}`
					)}
					placeholderText={`Loading ${title.toLowerCase()}…`}
					resource={notes}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No notes yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<NostrNoteView
							entityId={{ eventId: item[EntityMetaKey.Id].eventId }}
							href={resolve('/nostr/note/[eventId]', {
								eventId: item[EntityMetaKey.Id].eventId,
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
