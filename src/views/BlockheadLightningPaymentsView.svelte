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
		title = 'Lightning payments',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Lightning payments...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningPayments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadLightningPayment>
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
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					paymentHash: true,
					valueMsat: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningPayment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(blockheadLightningPayments)}
			{@const uniqueBlockheadLightningPayments = [...new Map(blockheadLightningPayments.values.map((blockheadLightningPayment) => [blockheadLightningPayment[EntityMetaKey.SelectorKey], blockheadLightningPayment])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadLightningPayment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadLightningPayments.values.length === uniqueBlockheadLightningPayments.length && blockheadLightningPayments.totalCount != null && blockheadLightningPayments.totalCount >= uniqueBlockheadLightningPayments.length ? blockheadLightningPayments.totalCount : uniqueBlockheadLightningPayments.length}
				getKey={(blockheadLightningPayment) => blockheadLightningPayment[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadLightningPayments}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lightning payments yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadLightningPayment }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadLightningPayment> })}
					<BlockheadLightningPaymentView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments/[paymentHash]', {
								networkSlug: String(({ ...blockheadLightningPayment.entitySelector, ...blockheadLightningPayment }).$network.slug),
								paymentHash: String(({ ...blockheadLightningPayment.entitySelector, ...blockheadLightningPayment }).paymentHash),
							})
						}
						selection={select(EntityType.BlockheadLightningPayment, blockheadLightningPayment.entitySelector)}
						prefetched={blockheadLightningPayment}
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
		entityType={EntityType.BlockheadLightningPayment}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
