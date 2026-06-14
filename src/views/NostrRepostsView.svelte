<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						(
							fieldOpen ?
								{
									sources: [Source.Constants_Internal],
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
										$$reposts: {
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
									sources: [Source.Constants_Internal],
								}
						)
					:
						{
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							$$reposts: {
								sources: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
								limit: limit,
							},
						}
				),
			)}
			{@const reposts = derive(
				parent,
				(parent) => {
					const nostrReposts: readonly Entity<typeof schema, EntityType.NostrRepost>[] = (
						entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent.$$nostrReposts ?? []),
								...(parent.$$nostrProfiles ?? [])
									.flatMap((profile: Entity<typeof schema, EntityType.NostrProfile>) => profile.$$reposts ?? []),
							]
						:
							(parent.fields[entityFieldReference.fieldName]?.values ?? [])
					)
					return nostrReposts
				},
			)}
			{#key `${stringify(entityFieldReference.selector)}-${limit}-${fieldOpen}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.NostrRepost}
					id={`${id}-items`}
					{title}
					getKey={(row) => row[EntityMetaKey.Selector].eventId}
					getSortValue={(row) => (
						`${String(-(row.createdAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Selector].eventId}`
					)}
					placeholderText={`Loading ${title.toLowerCase()}…`}
					resource={reposts}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No reposts yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<NostrRepostView
							selector={{ eventId: item[EntityMetaKey.Selector].eventId }}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
