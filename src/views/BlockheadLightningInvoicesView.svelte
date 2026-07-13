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
		title = 'Lightning invoices',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningInvoices-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLightningInvoice>
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
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
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
					memo: true,
					valueMsat: true,
					paymentHash: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningInvoice}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadLightningInvoices)}
			{@const uniqueBlockheadLightningInvoices = [...new Map(blockheadLightningInvoices.values.map((blockheadLightningInvoice) => [blockheadLightningInvoice[EntityMetaKey.SelectorKey], blockheadLightningInvoice])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningInvoice}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLightningInvoices.totalCount}
				getKey={(blockheadLightningInvoice) => blockheadLightningInvoice[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLightningInvoices}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning invoices yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLightningInvoice }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLightningInvoice> })}
					{@const blockheadLightningInvoiceFields = { ...blockheadLightningInvoice[EntityMetaKey.Selector], ...blockheadLightningInvoice }}
					{@const blockheadLightningInvoiceHrefFields = { ...blockheadLightningInvoice, ...blockheadLightningInvoice[EntityMetaKey.Selector] }}
					<BlockheadLightningInvoiceView
						selection={select(EntityType.BlockheadLightningInvoice, blockheadLightningInvoice[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadLightningInvoiceFields}
						href={
							(blockheadLightningInvoiceHrefFields.$network !== undefined && blockheadLightningInvoiceHrefFields.$network.slug !== undefined && blockheadLightningInvoiceHrefFields.paymentHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
								network: String(blockheadLightningInvoiceHrefFields.$network.slug ?? ''),
								paymentHash: String(blockheadLightningInvoiceHrefFields.paymentHash ?? ''),
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
		entityType={EntityType.BlockheadLightningInvoice}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
