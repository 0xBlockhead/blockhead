<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Liquidity pool blocks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPool_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPool_Block>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LiquidityPool_BlockView from '$/views/LiquidityPool_BlockView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					blockNumber: true,
					tick: true,
					$liquidityPool: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(liquidityPoolBlocks)}
			{@const uniqueLiquidityPoolBlocks = [...new Map(liquidityPoolBlocks.values.map((liquidityPoolBlock) => [liquidityPoolBlock[EntityMetaKey.SelectorKey], liquidityPoolBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPool_Block}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={liquidityPoolBlocks.totalCount}
				getKey={(liquidityPoolBlock) => liquidityPoolBlock[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPoolBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Liquidity pool blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPoolBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPool_Block> })}
					{@const liquidityPoolBlockFields = { ...liquidityPoolBlock[EntityMetaKey.Selector], ...liquidityPoolBlock }}
					{@const liquidityPoolBlockHrefFields = { ...liquidityPoolBlock, ...liquidityPoolBlock[EntityMetaKey.Selector] }}
					<LiquidityPool_BlockView
						selection={select(EntityType.LiquidityPool_Block, liquidityPoolBlock[EntityMetaKey.Selector])}
						prefetched={liquidityPoolBlockFields}
						href={
							(liquidityPoolBlockHrefFields.$liquidityPool !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2 !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2.reference !== undefined && liquidityPoolBlockHrefFields.$liquidityPool !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.id !== undefined && liquidityPoolBlockHrefFields.blockNumber !== undefined ? resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]/block/[blockNumber=nonNegativeInteger]', {
								chainId: String(liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2.reference ?? ''),
								poolId: String(liquidityPoolBlockHrefFields.$liquidityPool.id ?? ''),
								blockNumber: String(liquidityPoolBlockHrefFields.blockNumber ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.LiquidityPool_Block}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
