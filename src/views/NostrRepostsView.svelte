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
		title = 'Reposts',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrRepost>
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
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrRepost}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-6 repost events reference a kind-1 note via an <code>e</code>-tag; the repost’s own event id is a separate 64-character lowercase hex hash.
		</p>
		<p>
			Lists load from NostrBand and Primal HTTP indexers, scoped to the network hub or profile you navigated from.
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
										$$nostrReposts: {
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
												$$reposts: {
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
					:
						{
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							fields: {
								$$reposts: {
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
						entityType={EntityType.NostrRepost}
						id={`${id}-items`}
						{title}
						items={entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent?.['$$nostrReposts'].entities ?? []),
								...(parent?.['$$nostrProfiles'].entities ?? [])
									.flatMap((profile) => profile.current?.['$$reposts'].entities ?? []),
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
								No reposts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<NostrRepostView
								selector={{ eventId: item.entitySelector.eventId }}
								layout={EntityLayout.SummaryDetails}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
