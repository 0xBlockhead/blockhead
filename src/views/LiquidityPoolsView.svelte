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
		title = 'Liquidity pools',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Liquidity pools...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPool>
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
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Dexscreener-backed liquidity pools are token-pair pool rows, not an exhaustive on-chain registry.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					id: true,
					$network: true,
				},
				limit: 300,
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPool}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(liquidityPools)}
			{@const uniqueLiquidityPools = [...new Map(liquidityPools.values.map((liquidityPool) => [liquidityPool[EntityMetaKey.SelectorKey], liquidityPool])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LiquidityPool}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={liquidityPools.values.length === uniqueLiquidityPools.length && liquidityPools.totalCount != null && liquidityPools.totalCount >= uniqueLiquidityPools.length ? liquidityPools.totalCount : uniqueLiquidityPools.length}
				getKey={(liquidityPool) => liquidityPool[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPools}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No liquidity pools yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPool }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPool> })}
					<LiquidityPoolView
						href={
							resolve('/(assets)/pool/[chainId=eip155ChainId]/[poolId]', {
								chainId: String(({ ...liquidityPool.entitySelector, ...liquidityPool }).$network.caip2.reference),
								poolId: String(({ ...liquidityPool.entitySelector, ...liquidityPool }).id),
							})
						}
						selection={select(EntityType.LiquidityPool, liquidityPool.entitySelector)}
						prefetched={liquidityPool}
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
		entityType={EntityType.LiquidityPool}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
