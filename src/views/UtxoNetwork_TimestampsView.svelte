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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'UTXO network observations',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					timestampMs: true,
					bestBlockHeight: true,
					source: true,
					bestBlockHash: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={utxoNetworkTimestamps.totalCount}
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
					{@const utxoNetworkTimestampFields = { ...utxoNetworkTimestamp[EntityMetaKey.Selector], ...utxoNetworkTimestamp }}
					{@const utxoNetworkTimestampHrefFields = { ...utxoNetworkTimestamp, ...utxoNetworkTimestamp[EntityMetaKey.Selector] }}
					<UtxoNetwork_TimestampView
						selection={select(EntityType.UtxoNetwork_Timestamp, utxoNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={utxoNetworkTimestampFields}
						href={
							(utxoNetworkTimestampHrefFields.$network !== undefined && utxoNetworkTimestampHrefFields.$network.caip2 !== undefined && utxoNetworkTimestampHrefFields.$network.caip2.namespace !== undefined && utxoNetworkTimestampHrefFields.$network !== undefined && utxoNetworkTimestampHrefFields.$network.caip2 !== undefined && utxoNetworkTimestampHrefFields.$network.caip2.reference !== undefined && utxoNetworkTimestampHrefFields.timestampMs !== undefined && utxoNetworkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(networkByCaip2[String(String(utxoNetworkTimestampHrefFields.$network.caip2.namespace) + ':' + String(utxoNetworkTimestampHrefFields.$network.caip2.reference))].slug ?? ''),
								timestampMs: String(utxoNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(utxoNetworkTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
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
