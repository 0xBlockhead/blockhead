<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Hyperliquid spot assets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HyperliquidSpotAssets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.HyperliquidSpotAsset>
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
	entityType={EntityType.HyperliquidSpotAsset}
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
				name: true,
				assetId: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(hyperliquidSpotAssets) => [...new Map(hyperliquidSpotAssets.values.map((hyperliquidSpotAsset) => [hyperliquidSpotAsset[EntityMetaKey.SelectorKey], hyperliquidSpotAsset])).values()]}
	getKey={(hyperliquidSpotAsset) => hyperliquidSpotAsset[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hyperliquid spot assets yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hyperliquidSpotAsset })}
		{@const hyperliquidSpotAssetFields = { ...hyperliquidSpotAsset[EntityMetaKey.Selector], ...hyperliquidSpotAsset }}
		<EntityView
			entityType={EntityType.HyperliquidSpotAsset}
			entitySelector={hyperliquidSpotAsset[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((hyperliquidSpotAssetFields.name) ?? '')].filter(Boolean).join(' ') || [String((hyperliquidSpotAssetFields.assetId) ?? '')].filter(Boolean).join(' ') || 'hyperliquid spot asset'}
			{/snippet}

			{#snippet Value()}
				{[String((hyperliquidSpotAssetFields.assetId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((hyperliquidSpotAssetFields.$network.name) ?? '')].filter(Boolean).join(' ') || [hyperliquidSpotAssetFields.$network.caip2 == null ? '' : String(`${(hyperliquidSpotAssetFields.$network.caip2).namespace}:${(hyperliquidSpotAssetFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
