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
		title = 'Asset supply observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetSupply_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetSupply_Timestamp>
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
	entityType={EntityType.AssetSupply_Timestamp}
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
				supplyScopeKey: true,
				totalSupply: true,
				circulatingSupply: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(assetSupplyTimestamps) => [...new Map(assetSupplyTimestamps.values.map((assetSupplyTimestamp) => [assetSupplyTimestamp[EntityMetaKey.SelectorKey], assetSupplyTimestamp])).values()]}
	getKey={(assetSupplyTimestamp) => assetSupplyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Asset supply observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: assetSupplyTimestamp })}
		{@const assetSupplyTimestampFields = { ...assetSupplyTimestamp[EntityMetaKey.Selector], ...assetSupplyTimestamp }}
		<EntityView
			entityType={EntityType.AssetSupply_Timestamp}
			entitySelector={assetSupplyTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((assetSupplyTimestampFields.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply timestamp'}
			{/snippet}

			{#snippet Value()}
				{[(String((assetSupplyTimestampFields.totalSupply) ?? '') ? String((assetSupplyTimestampFields.totalSupply) ?? '') + assetSupplyTimestampFields.$assetInstance.symbol : ''), (String((assetSupplyTimestampFields.circulatingSupply) ?? '') ? String((assetSupplyTimestampFields.circulatingSupply) ?? '') + assetSupplyTimestampFields.$assetInstance.symbol : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((assetSupplyTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
