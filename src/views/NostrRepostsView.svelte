<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
		title = 'Reposts',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrRepost>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
				<ResourceBoundary resource={selection({
					sources: selection.entityType === EntityType.NostrNetwork ?
						[Source.Constants_Internal]
					: selection.entityType === EntityType.NostrProfile ?
						[Source.Constants_Internal]
					:
						[Source.NostrBand_Rest, Source.Primal_Rest],
					limit,
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
					{#snippet children(reposts)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrRepost}
						id={`${id}-items`}
						{title}
							items={reposts.entities}
						getKey={(row) => stringify(row[EntityMetaKey.Selector])}
						getSortValue={(row) => row[EntityMetaKey.Selector].eventId}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No reposts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(nostr)/nostr/repost/[eventId]', {
									eventId: item[EntityMetaKey.Selector].eventId,
								})}
							>
								<TruncatedValue
									value={item[EntityMetaKey.Selector].eventId}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
