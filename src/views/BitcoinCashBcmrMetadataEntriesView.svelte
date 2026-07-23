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
		title = 'Bitcoin Cash BCMR metadata entries',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashBcmrMetadataEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BitcoinCashBcmrMetadata>
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
	entityType={EntityType.BitcoinCashBcmrMetadata}
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
				symbol: true,
				categoryId: true,
				decimals: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bitcoinCashBcmrMetadataEntries) => [...new Map(bitcoinCashBcmrMetadataEntries.values.map((bitcoinCashBcmrMetadata) => [bitcoinCashBcmrMetadata[EntityMetaKey.SelectorKey], bitcoinCashBcmrMetadata])).values()]}
	getKey={(bitcoinCashBcmrMetadata) => bitcoinCashBcmrMetadata[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bitcoin Cash BCMR metadata entries yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bitcoinCashBcmrMetadata })}
		{@const bitcoinCashBcmrMetadataFields = { ...bitcoinCashBcmrMetadata[EntityMetaKey.Selector], ...bitcoinCashBcmrMetadata }}
		<EntityView
			entityType={EntityType.BitcoinCashBcmrMetadata}
			entitySelector={bitcoinCashBcmrMetadata[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bitcoinCashBcmrMetadataFields.name) ?? '')].filter(Boolean).join(' ') || [String((bitcoinCashBcmrMetadataFields.categoryId) ?? '')].filter(Boolean).join(' ') || 'Bitcoin cash bcmr metadata'}
			{/snippet}

			{#snippet Value()}
				{[String((bitcoinCashBcmrMetadataFields.symbol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bitcoinCashBcmrMetadataFields.decimals) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
