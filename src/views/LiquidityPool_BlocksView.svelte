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
		placeholderText = 'Loading Liquidity pool blocks...',
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
			selection.sources == null ? selection({
				fields: {
					blockNumber: true,
					tick: true,
					$liquidityPool: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
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
		{/snippet}

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
				totalCount={liquidityPoolBlocks.values.length === uniqueLiquidityPoolBlocks.length && liquidityPoolBlocks.totalCount != null && liquidityPoolBlocks.totalCount >= uniqueLiquidityPoolBlocks.length ? liquidityPoolBlocks.totalCount : uniqueLiquidityPoolBlocks.length}
				getKey={(liquidityPoolBlock) => liquidityPoolBlock[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPoolBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No liquidity pool blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPoolBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPool_Block> })}
					<LiquidityPool_BlockView
						href={
							resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]/block/[blockNumber=nonNegativeInteger]', {
								chainId: String(({ ...liquidityPoolBlock.entitySelector, ...liquidityPoolBlock }).$liquidityPool.$network.caip2.reference),
								poolId: String(({ ...liquidityPoolBlock.entitySelector, ...liquidityPoolBlock }).$liquidityPool.id),
								blockNumber: String(({ ...liquidityPoolBlock.entitySelector, ...liquidityPoolBlock }).blockNumber),
							})
						}
						selection={select(EntityType.LiquidityPool_Block, liquidityPoolBlock.entitySelector)}
						prefetched={liquidityPoolBlock}
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
