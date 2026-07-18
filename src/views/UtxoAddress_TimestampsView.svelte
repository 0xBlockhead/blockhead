<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'UTXO address observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoAddress_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.UtxoAddress_Timestamp>
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
	import UtxoAddress_TimestampView from '$/views/UtxoAddress_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoAddress_Timestamp}
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
				timestampMs: true,
				balanceSats: true,
				source: true,
				$address: true,
			},
		})
	}
	getResourceItems={(utxoAddressTimestamps) => [...new Map(utxoAddressTimestamps.values.map((utxoAddressTimestamp) => [utxoAddressTimestamp[EntityMetaKey.SelectorKey], utxoAddressTimestamp])).values()]}
	getKey={(utxoAddressTimestamp) => utxoAddressTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO address observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoAddressTimestamp })}
		{@const utxoAddressTimestampFields = { ...utxoAddressTimestamp[EntityMetaKey.Selector], ...utxoAddressTimestamp }}
		{@const selection = select(EntityType.UtxoAddress_Timestamp, utxoAddressTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const utxoAddressTimestampHrefFields = { ...utxoAddressTimestamp, ...utxoAddressTimestamp[EntityMetaKey.Selector] }}
		<UtxoAddress_TimestampView
			selection={selection}
			prefetched={utxoAddressTimestampFields}
			href={
				(utxoAddressTimestampHrefFields.timestampMs !== undefined && utxoAddressTimestampHrefFields.source !== undefined && utxoAddressTimestampHrefFields.$address !== undefined && utxoAddressTimestampHrefFields.$address.address !== undefined && utxoAddressTimestampHrefFields.$address.$network !== undefined && utxoAddressTimestampHrefFields.$address.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(utxoAddressTimestampHrefFields.timestampMs ?? ''),
					source: String(utxoAddressTimestampHrefFields.source ?? ''),
					address: String(utxoAddressTimestampHrefFields.$address.address ?? ''),
					network: String(caip2StringFromValue(utxoAddressTimestampHrefFields.$address.$network.caip2) ?? ''),
				}) : utxoAddressTimestampHrefFields.timestampMs !== undefined && utxoAddressTimestampHrefFields.source !== undefined && utxoAddressTimestampHrefFields.$address !== undefined && utxoAddressTimestampHrefFields.$address.address !== undefined && utxoAddressTimestampHrefFields.$address.$network !== undefined && utxoAddressTimestampHrefFields.$address.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(utxoAddressTimestampHrefFields.timestampMs ?? ''),
					source: String(utxoAddressTimestampHrefFields.source ?? ''),
					address: String(utxoAddressTimestampHrefFields.$address.address ?? ''),
					network: String(utxoAddressTimestampHrefFields.$address.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
