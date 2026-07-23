<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
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




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Coin>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Coin}
			entitySelector={coin[EntityMetaKey.Selector]}
			href={
				(
					coin[EntityMetaKey.Selector] != null && 'coinId' in coin[EntityMetaKey.Selector]
					&& coin[EntityMetaKey.Selector].coinId != null ?
						resolve('/coin/[coinId=stringSegment]', {
					coinId: String(coin[EntityMetaKey.Selector].coinId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((coinFields.symbol) ?? ''), String((coinFields.name) ?? '')].filter(Boolean).join(' ') || 'Coin'}
			{/snippet}

			{#snippet Value()}
				{[String((coinFields.symbol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
