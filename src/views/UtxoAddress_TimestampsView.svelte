<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoAddress_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.UtxoAddress_Timestamp}
			entitySelector={utxoAddressTimestamp[EntityMetaKey.Selector]}
			href={
				(
					utxoAddressTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in utxoAddressTimestamp[EntityMetaKey.Selector]
					&& utxoAddressTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& utxoAddressTimestamp[EntityMetaKey.Selector] != null && 'source' in utxoAddressTimestamp[EntityMetaKey.Selector]
					&& utxoAddressTimestamp[EntityMetaKey.Selector].source != null
					&& utxoAddressTimestamp[EntityMetaKey.Selector] != null && '$address' in utxoAddressTimestamp[EntityMetaKey.Selector]
					&& utxoAddressTimestamp[EntityMetaKey.Selector].$address != null && 'address' in utxoAddressTimestamp[EntityMetaKey.Selector].$address
					&& utxoAddressTimestamp[EntityMetaKey.Selector].$address.address != null
					&& utxoAddressTimestamp[EntityMetaKey.Selector].$address != null && '$network' in utxoAddressTimestamp[EntityMetaKey.Selector].$address ?
						utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network != null && 'caip2' in utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network
						&& utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(utxoAddressTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(utxoAddressTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(utxoAddressTimestamp[EntityMetaKey.Selector].$address.address ?? ''),
						network: String(caip2StringFromValue(utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network.caip2) ?? ''),
					})
					:
							utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network != null && 'slug' in utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network
							&& utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(utxoAddressTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(utxoAddressTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(utxoAddressTimestamp[EntityMetaKey.Selector].$address.address ?? ''),
							network: String(utxoAddressTimestamp[EntityMetaKey.Selector].$address.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((utxoAddressTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((utxoAddressTimestampFields.balanceSats) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((utxoAddressTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
