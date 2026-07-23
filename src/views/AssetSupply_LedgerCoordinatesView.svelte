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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetSupply_LedgerCoordinate>
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
	entityType={EntityType.AssetSupply_LedgerCoordinate}
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
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(assetSupplyLedgerCoordinates) => [...new Map(assetSupplyLedgerCoordinates.values.map((assetSupplyLedgerCoordinate) => [assetSupplyLedgerCoordinate[EntityMetaKey.SelectorKey], assetSupplyLedgerCoordinate])).values()]}
	getKey={(assetSupplyLedgerCoordinate) => assetSupplyLedgerCoordinate[EntityMetaKey.SelectorKey]}
	{placeholderText}
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
		<EntityView
			entityType={EntityType.AssetSupply_LedgerCoordinate}
			entitySelector={assetSupplyLedgerCoordinate[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((assetSupplyLedgerCoordinateFields.supplyScopeKey) ?? '')].filter(Boolean).join(' ') || 'asset supply ledger coordinate'}
			{/snippet}

			{#snippet Value()}
				{[(String((assetSupplyLedgerCoordinateFields.totalSupply) ?? '') ? String((assetSupplyLedgerCoordinateFields.totalSupply) ?? '') + assetSupplyLedgerCoordinateFields.$assetInstance.symbol : '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((assetSupplyLedgerCoordinateFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
