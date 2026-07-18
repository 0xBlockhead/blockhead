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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BitcoinCashBcmrMetadata>
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
	import BitcoinCashBcmrMetadataView from '$/views/BitcoinCashBcmrMetadataView.svelte'
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
		{@const selection = select(EntityType.BitcoinCashBcmrMetadata, bitcoinCashBcmrMetadata[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BitcoinCashBcmrMetadataView
			selection={selection}
			prefetched={bitcoinCashBcmrMetadataFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
