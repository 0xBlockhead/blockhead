<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
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
			collapsible?: boolean
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{@const parent = proxy(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						(
							fieldOpen ?
								{
									sources: [Source.Constants_Internal],
									fields: {
										$$nostrNotes: {
											sources: [Source.NostrBand_Rest],
											limit: limit,
										},
										$$nostrProfiles: {
											sources: [
												Source.Constants_Internal,
												Source.NostrBand_Rest,
												Source.Primal_Rest,
											],
											fields: {
												$$notes: {
													sources: [
														Source.NostrBand_Rest,
														Source.Primal_Rest,
													],
													limit: limit,
												},
											},
										},
									},
								}
							:
								{
									sources: [Source.Constants_Internal],
								}
						)
					: entityFieldReference.entityType === EntityType.NostrProfile ?
						{
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							fields: {
								$$notes: {
									sources: [
										Source.NostrBand_Rest,
										Source.Primal_Rest,
									],
									limit: limit,
								},
							},
						}
					:
						{
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							fields: {
								$$replies: {
									sources: [
										Source.NostrBand_Rest,
										Source.Primal_Rest,
									],
									limit: limit,
								},
							},
						}
				),
			)}
			<ResourceBoundary resource={parent} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrNote}
						id={`${id}-items`}
						{title}
						items={entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent?.['$$nostrNotes'].entities ?? []),
								...(parent?.['$$nostrProfiles'].entities ?? [])
									.flatMap((profile) => profile.current?.['$$notes'].entities ?? []),
							]
						:
							parent.fields[entityFieldReference.fieldName]?.entities ?? []}
						getKey={(row) => row.entitySelector.eventId}
						getSortValue={(row) => (
							`${String(-(row.current?.createdAt ?? 0)).padStart(20, '0')}\0${row.entitySelector.eventId}`
						)}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No notes yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<NostrNoteView
								selector={{ eventId: item.entitySelector.eventId }}
								href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
									eventId: item.entitySelector.eventId,
								})}
								layout={EntityLayout.SummaryDetails}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
