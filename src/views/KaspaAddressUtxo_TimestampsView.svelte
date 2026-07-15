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
		title = 'Kaspa address UTXO observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'KaspaAddressUtxo_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.KaspaAddressUtxo_Timestamp>
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
	import KaspaAddressUtxo_TimestampView from '$/views/KaspaAddressUtxo_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.KaspaAddressUtxo_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(kaspaAddressUtxoTimestamps)}
			{@const uniqueKaspaAddressUtxoTimestamps = [...new Map(kaspaAddressUtxoTimestamps.values.map((kaspaAddressUtxoTimestamp) => [kaspaAddressUtxoTimestamp[EntityMetaKey.SelectorKey], kaspaAddressUtxoTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.KaspaAddressUtxo_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={kaspaAddressUtxoTimestamps.totalCount}
				getKey={(kaspaAddressUtxoTimestamp) => kaspaAddressUtxoTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueKaspaAddressUtxoTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Kaspa address UTXO observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: kaspaAddressUtxoTimestamp })}
					{@const kaspaAddressUtxoTimestampFields = { ...kaspaAddressUtxoTimestamp[EntityMetaKey.Selector], ...kaspaAddressUtxoTimestamp }}
					{@const selection = select(EntityType.KaspaAddressUtxo_Timestamp, kaspaAddressUtxoTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<KaspaAddressUtxo_TimestampView
						selection={selection}
						prefetched={kaspaAddressUtxoTimestampFields}
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
		entityType={EntityType.KaspaAddressUtxo_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
