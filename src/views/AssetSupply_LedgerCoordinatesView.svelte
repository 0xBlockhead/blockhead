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
		title = 'Asset supply ledger coordinates',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetSupply_LedgerCoordinates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AssetSupply_LedgerCoordinate>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AssetSupply_LedgerCoordinateView from '$/views/AssetSupply_LedgerCoordinateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					supplyScopeKey: true,
					totalSupply: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetSupply_LedgerCoordinate}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(assetSupplyLedgerCoordinates)}
			{@const uniqueAssetSupplyLedgerCoordinates = [...new Map(assetSupplyLedgerCoordinates.values.map((assetSupplyLedgerCoordinate) => [assetSupplyLedgerCoordinate[EntityMetaKey.SelectorKey], assetSupplyLedgerCoordinate])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetSupply_LedgerCoordinate}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetSupplyLedgerCoordinates.totalCount}
				getKey={(assetSupplyLedgerCoordinate) => assetSupplyLedgerCoordinate[EntityMetaKey.SelectorKey]}
				items={uniqueAssetSupplyLedgerCoordinates}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset supply ledger coordinates yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetSupplyLedgerCoordinate })}
					{@const assetSupplyLedgerCoordinateFields = { ...assetSupplyLedgerCoordinate[EntityMetaKey.Selector], ...assetSupplyLedgerCoordinate }}
					{@const selection = select(EntityType.AssetSupply_LedgerCoordinate, assetSupplyLedgerCoordinate[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<AssetSupply_LedgerCoordinateView
						selection={selection}
						prefetched={assetSupplyLedgerCoordinateFields}
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
		entityType={EntityType.AssetSupply_LedgerCoordinate}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
