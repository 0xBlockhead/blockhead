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
		title = 'Market assets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MarketAssets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MarketAsset>
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
	import MarketAssetView from '$/views/MarketAssetView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MarketAsset}
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
				assetKey: true,
				kind: true,
			},
		})
	}
	getResourceItems={(marketAssets) => [...new Map(marketAssets.values.map((marketAsset) => [marketAsset[EntityMetaKey.SelectorKey], marketAsset])).values()]}
	getKey={(marketAsset) => marketAsset[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Market assets yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: marketAsset })}
		{@const marketAssetFields = { ...marketAsset[EntityMetaKey.Selector], ...marketAsset }}
		{@const selection = select(EntityType.MarketAsset, marketAsset[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const marketAssetHrefFields = { ...marketAsset, ...marketAsset[EntityMetaKey.Selector] }}
		<MarketAssetView
			selection={selection}
			prefetched={marketAssetFields}
			href={
				(marketAssetHrefFields.kind !== undefined && marketAssetHrefFields.assetKey !== undefined ? resolve('/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', {
					kind: String(marketAssetHrefFields.kind ?? ''),
					assetKey: String(marketAssetHrefFields.assetKey ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
