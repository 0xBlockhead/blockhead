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
		entityType: EntityType.Coin,
		emptyText: 'No coins to show yet.',
		item: 'Summary',
		placeholderText: 'Loading coins…',
		query: {
			sources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
			],
			limit: 300,
		},
		orderBy: [
			{
				field: 'marketCapRank',
				direction: 'asc',
			},
			{
				field: 'marketCapUsd',
				direction: 'desc',
			},
			{
				field: 'valueKey',
				direction: 'asc',
			},
		],
		itemLayout: EntityLayout.Summary,
		orientation: 'column',
	} as const

	let {
		selection,
		title,
		open = $bindable(true),
		id = 'Coins',
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Coin>
			title?: string
			open?: boolean
			id?: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinView from '$/views/CoinView.svelte'
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
		<CoinView
			selection={select(EntityType.Coin, item.entitySelector)}
			layout={listView.itemLayout}
		/>
	{/snippet}
</EntitiesList>
