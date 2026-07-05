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
		title = 'UTXO address observations',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					timestampMs: true,
					balanceSats: true,
					source: true,
					$address: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={utxoAddressTimestamps.totalCount}
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
					{@const utxoAddressTimestampFields = { ...utxoAddressTimestamp[EntityMetaKey.Selector], ...utxoAddressTimestamp }}
					{@const utxoAddressTimestampHrefFields = { ...utxoAddressTimestamp, ...utxoAddressTimestamp[EntityMetaKey.Selector] }}
					<UtxoAddress_TimestampView
						selection={select(EntityType.UtxoAddress_Timestamp, utxoAddressTimestamp[EntityMetaKey.Selector])}
						prefetched={utxoAddressTimestampFields}
						href={
							(utxoAddressTimestampHrefFields.$address !== undefined && utxoAddressTimestampHrefFields.$address.caip2 !== undefined && utxoAddressTimestampHrefFields.$address.caip2.namespace !== undefined && utxoAddressTimestampHrefFields.$address !== undefined && utxoAddressTimestampHrefFields.$address.caip2 !== undefined && utxoAddressTimestampHrefFields.$address.caip2.reference !== undefined && utxoAddressTimestampHrefFields.$address !== undefined && utxoAddressTimestampHrefFields.$address.address !== undefined && utxoAddressTimestampHrefFields.timestampMs !== undefined && utxoAddressTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(networkByCaip2[String(String(utxoAddressTimestampHrefFields.$address.caip2.namespace) + ':' + String(utxoAddressTimestampHrefFields.$address.caip2.reference))].slug ?? ''),
								address: String(utxoAddressTimestampHrefFields.$address.address ?? ''),
								timestampMs: String(utxoAddressTimestampHrefFields.timestampMs ?? ''),
								source: String(utxoAddressTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.UtxoAddress_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
