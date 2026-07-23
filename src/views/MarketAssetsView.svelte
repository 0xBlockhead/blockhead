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




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MarketAsset>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.MarketAsset}
			entitySelector={marketAsset[EntityMetaKey.Selector]}
			href={
				(
					marketAsset[EntityMetaKey.Selector] != null && 'kind' in marketAsset[EntityMetaKey.Selector]
					&& marketAsset[EntityMetaKey.Selector].kind != null
					&& marketAsset[EntityMetaKey.Selector] != null && 'assetKey' in marketAsset[EntityMetaKey.Selector]
					&& marketAsset[EntityMetaKey.Selector].assetKey != null ?
						resolve('/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', {
					kind: String(marketAsset[EntityMetaKey.Selector].kind ?? ''),
					assetKey: String(marketAsset[EntityMetaKey.Selector].assetKey ?? ''),
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
				{[String((marketAssetFields.assetKey) ?? '')].filter(Boolean).join(' ') || 'Market asset'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((marketAssetFields.kind) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
