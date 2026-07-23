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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningInvoice>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadLightningInvoice}
			entitySelector={blockheadLightningInvoice[EntityMetaKey.Selector]}
			href={
				(
					blockheadLightningInvoice[EntityMetaKey.Selector] != null && 'paymentHash' in blockheadLightningInvoice[EntityMetaKey.Selector]
					&& blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash != null
					&& blockheadLightningInvoice[EntityMetaKey.Selector] != null && '$network' in blockheadLightningInvoice[EntityMetaKey.Selector] ?
						blockheadLightningInvoice[EntityMetaKey.Selector].$network != null && 'caip2' in blockheadLightningInvoice[EntityMetaKey.Selector].$network
						&& blockheadLightningInvoice[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
						paymentHash: String(blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash ?? ''),
						network: String(caip2StringFromValue(blockheadLightningInvoice[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							blockheadLightningInvoice[EntityMetaKey.Selector].$network != null && 'slug' in blockheadLightningInvoice[EntityMetaKey.Selector].$network
							&& blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
							paymentHash: String(blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash ?? ''),
							network: String(blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((blockheadLightningInvoiceFields.memo) ?? '')].filter(Boolean).join(' ') || [String((blockheadLightningInvoiceFields.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningInvoiceFields.valueMsat) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
