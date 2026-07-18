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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.UtxoAddress>
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
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
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
		{@const selection = select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const utxoAddressHrefFields = { ...utxoAddress, ...utxoAddress[EntityMetaKey.Selector] }}
		<UtxoAddressView
			selection={selection}
			prefetched={utxoAddressFields}
			href={
				(utxoAddressHrefFields.address !== undefined && utxoAddressHrefFields.$network !== undefined && utxoAddressHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
					address: String(utxoAddressHrefFields.address ?? ''),
					network: String(caip2StringFromValue(utxoAddressHrefFields.$network.caip2) ?? ''),
				}) : utxoAddressHrefFields.address !== undefined && utxoAddressHrefFields.$network !== undefined && utxoAddressHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
					address: String(utxoAddressHrefFields.address ?? ''),
					network: String(utxoAddressHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
