<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Lightning invoice observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningInvoice_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningInvoice_Timestamp>
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
	entityType={EntityType.BlockheadLightningInvoice_Timestamp}
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
				state: true,
				amountPaidMsat: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningInvoiceTimestamps) => [...new Map(blockheadLightningInvoiceTimestamps.values.map((blockheadLightningInvoiceTimestamp) => [blockheadLightningInvoiceTimestamp[EntityMetaKey.SelectorKey], blockheadLightningInvoiceTimestamp])).values()]}
	getKey={(blockheadLightningInvoiceTimestamp) => blockheadLightningInvoiceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning invoice observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningInvoiceTimestamp })}
		{@const blockheadLightningInvoiceTimestampFields = { ...blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector], ...blockheadLightningInvoiceTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLightningInvoice_Timestamp}
			entitySelector={blockheadLightningInvoiceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLightningInvoiceTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningInvoiceTimestampFields.state) ?? ''), String((blockheadLightningInvoiceTimestampFields.amountPaidMsat) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
