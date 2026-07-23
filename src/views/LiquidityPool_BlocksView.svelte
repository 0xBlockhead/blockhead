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
		title = 'Liquidity pool blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPool_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LiquidityPool_Block>
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
	entityType={EntityType.LiquidityPool_Block}
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
				blockNumber: true,
				tick: true,
				$liquidityPool: true,
			},
		})
	}
	{countResource}
	getResourceItems={(liquidityPoolBlocks) => [...new Map(liquidityPoolBlocks.values.map((liquidityPoolBlock) => [liquidityPoolBlock[EntityMetaKey.SelectorKey], liquidityPoolBlock])).values()]}
	getKey={(liquidityPoolBlock) => liquidityPoolBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Liquidity pool blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: liquidityPoolBlock })}
		{@const liquidityPoolBlockFields = { ...liquidityPoolBlock[EntityMetaKey.Selector], ...liquidityPoolBlock }}
		<EntityView
			entityType={EntityType.LiquidityPool_Block}
			entitySelector={liquidityPoolBlock[EntityMetaKey.Selector]}
			href={
				(
					liquidityPoolBlock[EntityMetaKey.Selector] != null && 'blockNumber' in liquidityPoolBlock[EntityMetaKey.Selector]
					&& liquidityPoolBlock[EntityMetaKey.Selector].blockNumber != null
					&& liquidityPoolBlock[EntityMetaKey.Selector] != null && '$liquidityPool' in liquidityPoolBlock[EntityMetaKey.Selector]
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool != null && '$network' in liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network != null && 'caip2' in liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network.caip2 != null && 'reference' in liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network.caip2
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network.caip2.reference != null
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool != null && 'id' in liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool
					&& liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.id != null ?
						resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/block/[blockNumber=nonNegativeBigInt]', {
					blockNumber: String(liquidityPoolBlock[EntityMetaKey.Selector].blockNumber ?? ''),
					chainId: String(liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.$network.caip2.reference ?? ''),
					poolId: String(liquidityPoolBlock[EntityMetaKey.Selector].$liquidityPool.id ?? ''),
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
				{[String((liquidityPoolBlockFields.blockNumber) ?? '')].filter(Boolean).join(' ') || 'liquidity pool block'}
			{/snippet}

			{#snippet Value()}
				{[String((liquidityPoolBlockFields.tick) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((liquidityPoolBlockFields.$liquidityPool.id) ?? '')].filter(Boolean).join(' ') || 'liquidity pool'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
