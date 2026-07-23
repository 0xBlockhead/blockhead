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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LiquidityPool>
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
			sources: selection.sources ?? [
				Source.Dexscreener_OpenApi,
			],
			fields: {
				id: true,
				$network: true,
			},
			limit: 300,
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.LiquidityPool}
			entitySelector={liquidityPool[EntityMetaKey.Selector]}
			href={
				(
					liquidityPool[EntityMetaKey.Selector] != null && 'id' in liquidityPool[EntityMetaKey.Selector]
					&& liquidityPool[EntityMetaKey.Selector].id != null
					&& liquidityPool[EntityMetaKey.Selector] != null && '$network' in liquidityPool[EntityMetaKey.Selector]
					&& liquidityPool[EntityMetaKey.Selector].$network != null && 'caip2' in liquidityPool[EntityMetaKey.Selector].$network
					&& liquidityPool[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in liquidityPool[EntityMetaKey.Selector].$network.caip2
					&& liquidityPool[EntityMetaKey.Selector].$network.caip2.reference != null ?
						resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
					poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
					chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
				{[String((liquidityPoolFields.id) ?? '')].filter(Boolean).join(' ') || 'liquidity pool'}
			{/snippet}

			{#snippet Value()}
				{[String((liquidityPoolFields.id) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((liquidityPoolFields.$network.name) ?? '')].filter(Boolean).join(' ') || [liquidityPoolFields.$network.caip2 == null ? '' : String(`${(liquidityPoolFields.$network.caip2).namespace}:${(liquidityPoolFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
