<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'UTXO address observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading UTXO address observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoAddress_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoAddress_Timestamp>
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
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					timestampMs: true,
					balanceSats: true,
					source: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoAddress_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(utxoAddressTimestamps)}
			{@const uniqueUtxoAddressTimestamps = [...new Map(utxoAddressTimestamps.values.map((utxoAddressTimestamp) => [utxoAddressTimestamp[EntityMetaKey.SelectorKey], utxoAddressTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoAddress_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoAddressTimestamps.values.length === uniqueUtxoAddressTimestamps.length && utxoAddressTimestamps.totalCount != null && utxoAddressTimestamps.totalCount >= uniqueUtxoAddressTimestamps.length ? utxoAddressTimestamps.totalCount : uniqueUtxoAddressTimestamps.length}
				getKey={(utxoAddressTimestamp) => utxoAddressTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoAddressTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO address observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoAddressTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoAddress_Timestamp> })}
					<UtxoAddress_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(({ ...utxoAddressTimestamp.entitySelector, ...utxoAddressTimestamp }).$address.slug),
								address: String(({ ...utxoAddressTimestamp.entitySelector, ...utxoAddressTimestamp }).$address.address),
								timestampMs: String(({ ...utxoAddressTimestamp.entitySelector, ...utxoAddressTimestamp }).timestampMs),
								source: String(({ ...utxoAddressTimestamp.entitySelector, ...utxoAddressTimestamp }).source),
							})
						}
						selection={select(EntityType.UtxoAddress_Timestamp, utxoAddressTimestamp.entitySelector)}
						prefetched={utxoAddressTimestamp}
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
		entityType={EntityType.UtxoAddress_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
