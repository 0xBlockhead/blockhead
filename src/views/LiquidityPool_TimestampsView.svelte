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




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LiquidityPool_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.LiquidityPool_Timestamp}
			entitySelector={liquidityPoolTimestamp[EntityMetaKey.Selector]}
			href={
				(
					liquidityPoolTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in liquidityPoolTimestamp[EntityMetaKey.Selector]
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& liquidityPoolTimestamp[EntityMetaKey.Selector] != null && 'feedKey' in liquidityPoolTimestamp[EntityMetaKey.Selector]
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].feedKey != null
					&& liquidityPoolTimestamp[EntityMetaKey.Selector] != null && '$liquidityPool' in liquidityPoolTimestamp[EntityMetaKey.Selector]
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool != null && '$network' in liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network != null && 'caip2' in liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network.caip2 != null && 'reference' in liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network.caip2
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network.caip2.reference != null
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool != null && 'id' in liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool
					&& liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.id != null ?
						resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
					timestampMs: String(liquidityPoolTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					feedKey: encodeURIComponent(String(liquidityPoolTimestamp[EntityMetaKey.Selector].feedKey ?? '')),
					chainId: String(liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.$network.caip2.reference ?? ''),
					poolId: String(liquidityPoolTimestamp[EntityMetaKey.Selector].$liquidityPool.id ?? ''),
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
				{[String((liquidityPoolTimestampFields.baseTokenSymbol) ?? ''), String((liquidityPoolTimestampFields.quoteTokenSymbol) ?? '')].filter(Boolean).join(' ') || 'liquidity pool timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((liquidityPoolTimestampFields.priceUsd) ?? ''), String((liquidityPoolTimestampFields.liquidityUsd) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((liquidityPoolTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
