<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	const listView = {
		entityType: EntityType.Market,
		emptyText: 'No markets in this context yet.',
		item: 'Title',
		itemOpen: false,
		placeholderText: 'Loading markets…',
		query: {
			sources: [
				Source.Constants_Internal,
			],
		},
		itemLayout: EntityLayout.Title,
		orientation: 'column',
	} as const

	let {
		selection,
		title,
		open = $bindable(true),
		id = 'Markets',
		href = '',
		filterMarketVenue,
		filterMarketKind,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market>
			title?: string
			open?: boolean
			id?: string
			href?: string
			filterMarketVenue?: EntitySelector<typeof schema, EntityType.Market>['$marketVenue']
			filterMarketKind?: EntitySelector<typeof schema, EntityType.Market>['marketKind']
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
</script>


<EntitiesList
	entityType={listView.entityType}
	{title}
	bind:open
	{id}
	href={href}
	resource={selection(listView.query)}
	getKey={(entity) => stringify(entity.entitySelector)}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	placeholderText={listView.placeholderText}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			{listView.emptyText}
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{#if (filterMarketVenue === undefined || item.entitySelector.$marketVenue === filterMarketVenue) && (filterMarketKind === undefined || item.entitySelector.marketKind === filterMarketKind)}
			<MarketView
				selection={select(EntityType.Market, item.entitySelector)}
				layout={listView.itemLayout}
				open={listView.itemOpen}
			/>
		{/if}
	{/snippet}
</EntitiesList>
