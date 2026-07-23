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
		title = 'UTXO addresses',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoAddresses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoAddress>
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
	entityType={EntityType.UtxoAddress}
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
				address: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(utxoAddresses) => [...new Map(utxoAddresses.values.map((utxoAddress) => [utxoAddress[EntityMetaKey.SelectorKey], utxoAddress])).values()]}
	getKey={(utxoAddress) => utxoAddress[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO addresses yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoAddress })}
		{@const utxoAddressFields = { ...utxoAddress[EntityMetaKey.Selector], ...utxoAddress }}
		<EntityView
			entityType={EntityType.UtxoAddress}
			entitySelector={utxoAddress[EntityMetaKey.Selector]}
			href={
				(
					utxoAddress[EntityMetaKey.Selector] != null && 'address' in utxoAddress[EntityMetaKey.Selector]
					&& utxoAddress[EntityMetaKey.Selector].address != null
					&& utxoAddress[EntityMetaKey.Selector] != null && '$network' in utxoAddress[EntityMetaKey.Selector] ?
						utxoAddress[EntityMetaKey.Selector].$network != null && 'caip2' in utxoAddress[EntityMetaKey.Selector].$network
						&& utxoAddress[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
						address: String(utxoAddress[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(utxoAddress[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							utxoAddress[EntityMetaKey.Selector].$network != null && 'slug' in utxoAddress[EntityMetaKey.Selector].$network
							&& utxoAddress[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
							address: String(utxoAddress[EntityMetaKey.Selector].address ?? ''),
							network: String(utxoAddress[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((utxoAddressFields.address) ?? '')].filter(Boolean).join(' ') || 'UTXO address'}
			{/snippet}

			{#snippet Value()}
				{[String((utxoAddressFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((utxoAddressFields.$network.name) ?? '')].filter(Boolean).join(' ') || [utxoAddressFields.$network.caip2 == null ? '' : String(`${(utxoAddressFields.$network.caip2).namespace}:${(utxoAddressFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
