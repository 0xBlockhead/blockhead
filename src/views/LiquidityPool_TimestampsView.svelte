<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Liquidity pool observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPool_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LiquidityPool_Timestamp>
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
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool_Timestamp}
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
				baseTokenSymbol: true,
				quoteTokenSymbol: true,
				priceUsd: true,
				liquidityUsd: true,
				timestampMs: true,
				feedKey: true,
				$liquidityPool: true,
			},
		})
	}
	getResourceItems={(liquidityPoolTimestamps) => [...new Map(liquidityPoolTimestamps.values.map((liquidityPoolTimestamp) => [liquidityPoolTimestamp[EntityMetaKey.SelectorKey], liquidityPoolTimestamp])).values()]}
	getKey={(liquidityPoolTimestamp) => liquidityPoolTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Liquidity pool observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: liquidityPoolTimestamp })}
		{@const liquidityPoolTimestampFields = { ...liquidityPoolTimestamp[EntityMetaKey.Selector], ...liquidityPoolTimestamp }}
		{@const selection = select(EntityType.LiquidityPool_Timestamp, liquidityPoolTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const liquidityPoolTimestampHrefFields = { ...liquidityPoolTimestamp, ...liquidityPoolTimestamp[EntityMetaKey.Selector] }}
		<LiquidityPool_TimestampView
			selection={selection}
			prefetched={liquidityPoolTimestampFields}
			href={
				(liquidityPoolTimestampHrefFields.timestampMs !== undefined && liquidityPoolTimestampHrefFields.feedKey !== undefined && liquidityPoolTimestampHrefFields.$liquidityPool !== undefined && liquidityPoolTimestampHrefFields.$liquidityPool.$network !== undefined && liquidityPoolTimestampHrefFields.$liquidityPool.$network.caip2 !== undefined && liquidityPoolTimestampHrefFields.$liquidityPool.$network.caip2.reference !== undefined && liquidityPoolTimestampHrefFields.$liquidityPool.id !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
					timestampMs: String(liquidityPoolTimestampHrefFields.timestampMs ?? ''),
					feedKey: encodeURIComponent(String(liquidityPoolTimestampHrefFields.feedKey ?? '')),
					chainId: String(liquidityPoolTimestampHrefFields.$liquidityPool.$network.caip2.reference ?? ''),
					poolId: String(liquidityPoolTimestampHrefFields.$liquidityPool.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
