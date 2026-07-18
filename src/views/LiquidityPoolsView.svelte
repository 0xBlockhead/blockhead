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
		title = 'Liquidity pools',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LiquidityPools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LiquidityPool>
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

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			fields: {
				id: true,
				$network: true,
			},
			limit: 300,
		})
	}
	getResourceItems={(liquidityPools) => [...new Map(liquidityPools.values.map((liquidityPool) => [liquidityPool[EntityMetaKey.SelectorKey], liquidityPool])).values()]}
	getKey={(liquidityPool) => liquidityPool[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Liquidity pools yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: liquidityPool })}
		{@const liquidityPoolFields = { ...liquidityPool[EntityMetaKey.Selector], ...liquidityPool }}
		{@const selection = select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const liquidityPoolHrefFields = { ...liquidityPool, ...liquidityPool[EntityMetaKey.Selector] }}
		<LiquidityPoolView
			selection={selection}
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
