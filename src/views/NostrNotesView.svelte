<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
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
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
				<ResourceBoundary resource={selection({
					sources: selection.entityType === EntityType.NostrNetwork ?
						[Source.Constants_Internal, Source.NostrBand_Rest, Source.Primal_Rest]
					:
						[Source.NostrBand_Rest, Source.Primal_Rest],
					limit,
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
					{#snippet children(notes)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrNote}
						id={`${id}-items`}
						{title}
							items={notes.entities}
						getKey={(row) => row.entitySelector.eventId}
						getSortValue={(row) => row.entitySelector.eventId}
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
