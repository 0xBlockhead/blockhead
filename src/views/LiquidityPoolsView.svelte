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
		placeholderText,
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
			selection({
				fields: {
					id: true,
					$network: true,
				},
				limit: 300,
			})
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
				placeholderText={placeholderText}
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
				totalCount={liquidityPools.totalCount}
				getKey={(liquidityPool) => liquidityPool[EntityMetaKey.SelectorKey]}
				items={uniqueLiquidityPools}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Liquidity pools yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: liquidityPool }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LiquidityPool> })}
					{@const liquidityPoolFields = { ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }}
					{@const liquidityPoolHrefFields = { ...liquidityPool, ...liquidityPool[EntityMetaKey.Selector] }}
					<LiquidityPoolView
						selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={liquidityPoolFields}
						href={
							(liquidityPoolHrefFields.id !== undefined && liquidityPoolHrefFields.$network !== undefined && liquidityPoolHrefFields.$network.caip2 !== undefined && liquidityPoolHrefFields.$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
								poolId: String(liquidityPoolHrefFields.id ?? ''),
								chainId: String(liquidityPoolHrefFields.$network.caip2.reference ?? ''),
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
		entityType={EntityType.LiquidityPool}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
