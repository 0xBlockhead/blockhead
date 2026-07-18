<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AssetSupply_Timestamp>
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
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
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
		{@const selection = select(EntityType.AssetSupply_Timestamp, assetSupplyTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AssetSupply_TimestampView
			selection={selection}
			prefetched={assetSupplyTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
