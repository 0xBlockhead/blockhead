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
		title = 'Liquidity position blocks',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Liquidity position blocks...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPosition_Blocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPosition_Block>
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
	import LiquidityPosition_BlockView from '$/views/LiquidityPosition_BlockView.svelte'
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
					liquidity: true,
					$position: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPosition_Block}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(liquidityPositionBlocks)}
			{@const uniqueLiquidityPositionBlocks = [...new Map(liquidityPositionBlocks.values.map((liquidityPositionBlock) => [liquidityPositionBlock[EntityMetaKey.SelectorKey], liquidityPositionBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPosition_Block}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={liquidityPositionBlocks.values.length === uniqueLiquidityPositionBlocks.length && liquidityPositionBlocks.totalCount != null && liquidityPositionBlocks.totalCount >= uniqueLiquidityPositionBlocks.length ? liquidityPositionBlocks.totalCount : uniqueLiquidityPositionBlocks.length}
				getKey={(liquidityPositionBlock) => liquidityPositionBlock[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPositionBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No liquidity position blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPositionBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPosition_Block> })}
					<LiquidityPosition_BlockView
						href={
							resolve('/(assets)/position/[positionId]/block/[blockNumber=nonNegativeInteger]/[source]', {
								positionId: String(({ ...liquidityPositionBlock.entitySelector, ...liquidityPositionBlock }).$position.id),
								blockNumber: String(({ ...liquidityPositionBlock.entitySelector, ...liquidityPositionBlock }).blockNumber),
								source: String(({ ...liquidityPositionBlock.entitySelector, ...liquidityPositionBlock }).source),
							})
						}
						selection={select(EntityType.LiquidityPosition_Block, liquidityPositionBlock.entitySelector)}
						prefetched={liquidityPositionBlock}
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
		entityType={EntityType.LiquidityPosition_Block}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
