<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinId } from '$/constants/Coin.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import Heading from '$/components/Heading.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmCoinInstancesView from '$/views/EvmCoinInstancesView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Coins',
		typeAnnotationParagraphs = ['A market-facing coin or crypto asset identity used across price, market, and network contexts.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Coins-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Coin>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinView from '$/views/CoinView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Coin}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$logo: true,
				symbol: true,
				name: true,
				coinId: true,
			},
		})
	}
	getResourceItems={(coins) => [...new Map(coins.values.map((coin) => [coin[EntityMetaKey.SelectorKey], coin])).values()]}
	getKey={(coin) => coin[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Coins yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: coin })}
		{@const coinFields = { ...coin[EntityMetaKey.Selector], ...coin }}
		{@const selection = select(EntityType.Coin, coin[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const coinHrefFields = { ...coin, ...coin[EntityMetaKey.Selector] }}
		<CoinView
			selection={selection}
			prefetched={coinFields}
			href={
				(coinHrefFields.coinId !== undefined ? resolve('/coin/[coinId=stringSegment]', {
					coinId: String(coinHrefFields.coinId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
