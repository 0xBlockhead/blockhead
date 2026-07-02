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
		title = 'UTXO network observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading UTXO network observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoNetwork_Timestamp>
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
	import UtxoNetwork_TimestampView from '$/views/UtxoNetwork_TimestampView.svelte'
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
					bestBlockHeight: true,
					source: true,
					bestBlockHash: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(utxoNetworkTimestamps)}
			{@const uniqueUtxoNetworkTimestamps = [...new Map(utxoNetworkTimestamps.values.map((utxoNetworkTimestamp) => [utxoNetworkTimestamp[EntityMetaKey.SelectorKey], utxoNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoNetworkTimestamps.values.length === uniqueUtxoNetworkTimestamps.length && utxoNetworkTimestamps.totalCount != null && utxoNetworkTimestamps.totalCount >= uniqueUtxoNetworkTimestamps.length ? utxoNetworkTimestamps.totalCount : uniqueUtxoNetworkTimestamps.length}
				getKey={(utxoNetworkTimestamp) => utxoNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoNetwork_Timestamp> })}
					<UtxoNetwork_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(({ ...utxoNetworkTimestamp.entitySelector, ...utxoNetworkTimestamp }).$network.slug),
								timestampMs: String(({ ...utxoNetworkTimestamp.entitySelector, ...utxoNetworkTimestamp }).timestampMs),
								source: String(({ ...utxoNetworkTimestamp.entitySelector, ...utxoNetworkTimestamp }).source),
							})
						}
						selection={select(EntityType.UtxoNetwork_Timestamp, utxoNetworkTimestamp.entitySelector)}
						prefetched={utxoNetworkTimestamp}
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
		entityType={EntityType.UtxoNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
