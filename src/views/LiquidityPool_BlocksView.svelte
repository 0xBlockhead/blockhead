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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LiquidityPool_Block>
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
	import LiquidityPool_BlockView from '$/views/LiquidityPool_BlockView.svelte'
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
		{@const selection = select(EntityType.LiquidityPool_Block, liquidityPoolBlock[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const liquidityPoolBlockHrefFields = { ...liquidityPoolBlock, ...liquidityPoolBlock[EntityMetaKey.Selector] }}
		<LiquidityPool_BlockView
			selection={selection}
			prefetched={liquidityPoolBlockFields}
			href={
				(liquidityPoolBlockHrefFields.blockNumber !== undefined && liquidityPoolBlockHrefFields.$liquidityPool !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2 !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2.reference !== undefined && liquidityPoolBlockHrefFields.$liquidityPool.id !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/block/[blockNumber=nonNegativeBigInt]', {
					blockNumber: String(liquidityPoolBlockHrefFields.blockNumber ?? ''),
					chainId: String(liquidityPoolBlockHrefFields.$liquidityPool.$network.caip2.reference ?? ''),
					poolId: String(liquidityPoolBlockHrefFields.$liquidityPool.id ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
