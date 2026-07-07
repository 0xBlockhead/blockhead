<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Bitcoin Cash BCMR metadata entries',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BitcoinCashBcmrMetadataEntries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BitcoinCashBcmrMetadata>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BitcoinCashBcmrMetadataView from '$/views/BitcoinCashBcmrMetadataView.svelte'
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
					name: true,
					symbol: true,
					categoryId: true,
					decimals: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashBcmrMetadata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(bitcoinCashBcmrMetadataEntries)}
			{@const uniqueBitcoinCashBcmrMetadataEntries = [...new Map(bitcoinCashBcmrMetadataEntries.values.map((bitcoinCashBcmrMetadata) => [bitcoinCashBcmrMetadata[EntityMetaKey.SelectorKey], bitcoinCashBcmrMetadata])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BitcoinCashBcmrMetadata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={bitcoinCashBcmrMetadataEntries.totalCount}
				getKey={(bitcoinCashBcmrMetadata) => bitcoinCashBcmrMetadata[EntityMetaKey.SelectorKey]}
				items={uniqueBitcoinCashBcmrMetadataEntries}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Bitcoin Cash BCMR metadata entries yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: bitcoinCashBcmrMetadata }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BitcoinCashBcmrMetadata> })}
					{@const bitcoinCashBcmrMetadataFields = { ...bitcoinCashBcmrMetadata[EntityMetaKey.Selector], ...bitcoinCashBcmrMetadata }}
					<BitcoinCashBcmrMetadataView
						selection={select(EntityType.BitcoinCashBcmrMetadata, bitcoinCashBcmrMetadata[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={bitcoinCashBcmrMetadataFields}
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
		entityType={EntityType.BitcoinCashBcmrMetadata}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
