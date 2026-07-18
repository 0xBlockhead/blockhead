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
		title = 'Lightning invoices',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningInvoices-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLightningInvoice>
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
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningInvoice}
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
				memo: true,
				valueMsat: true,
				paymentHash: true,
				$network: true,
			},
		})
	}
	getResourceItems={(blockheadLightningInvoices) => [...new Map(blockheadLightningInvoices.values.map((blockheadLightningInvoice) => [blockheadLightningInvoice[EntityMetaKey.SelectorKey], blockheadLightningInvoice])).values()]}
	getKey={(blockheadLightningInvoice) => blockheadLightningInvoice[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning invoices yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningInvoice })}
		{@const blockheadLightningInvoiceFields = { ...blockheadLightningInvoice[EntityMetaKey.Selector], ...blockheadLightningInvoice }}
		{@const selection = select(EntityType.BlockheadLightningInvoice, blockheadLightningInvoice[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadLightningInvoiceHrefFields = { ...blockheadLightningInvoice, ...blockheadLightningInvoice[EntityMetaKey.Selector] }}
		<BlockheadLightningInvoiceView
			selection={selection}
			prefetched={blockheadLightningInvoiceFields}
			href={
				(blockheadLightningInvoiceHrefFields.paymentHash !== undefined && blockheadLightningInvoiceHrefFields.$network !== undefined && blockheadLightningInvoiceHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
					paymentHash: String(blockheadLightningInvoiceHrefFields.paymentHash ?? ''),
					network: String(caip2StringFromValue(blockheadLightningInvoiceHrefFields.$network.caip2) ?? ''),
				}) : blockheadLightningInvoiceHrefFields.paymentHash !== undefined && blockheadLightningInvoiceHrefFields.$network !== undefined && blockheadLightningInvoiceHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
					paymentHash: String(blockheadLightningInvoiceHrefFields.paymentHash ?? ''),
					network: String(blockheadLightningInvoiceHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
