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
		title = 'EVM transactions',
		typeAnnotationParagraphs = ['A transaction submitted to or included in an EVM-compatible network.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTransaction>
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
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
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
					txHash: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmTransactions)}
			{@const uniqueEvmTransactions = [...new Map(evmTransactions.values.map((evmTransaction) => [evmTransaction[EntityMetaKey.SelectorKey], evmTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmTransactions.totalCount}
				getKey={(evmTransaction) => evmTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueEvmTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmTransaction> })}
					{@const evmTransactionFields = { ...evmTransaction[EntityMetaKey.Selector], ...evmTransaction }}
					{@const evmTransactionHrefFields = { ...evmTransaction, ...evmTransaction[EntityMetaKey.Selector] }}
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmTransactionFields}
						href={
							(evmTransactionHrefFields.$network !== undefined && evmTransactionHrefFields.$network.caip2 !== undefined && evmTransactionHrefFields.$network.caip2.namespace !== undefined && evmTransactionHrefFields.$network !== undefined && evmTransactionHrefFields.$network.caip2 !== undefined && evmTransactionHrefFields.$network.caip2.reference !== undefined && evmTransactionHrefFields.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(evmTransactionHrefFields.$network.caip2.namespace ?? '')}:${String(evmTransactionHrefFields.$network.caip2.reference ?? '')}`,
								transactionId: String(evmTransactionHrefFields.txHash ?? ''),
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
		entityType={EntityType.EvmTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
