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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'UTXO transactions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoTransaction>
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
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
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
					txId: true,
					feeSats: true,
					isCoinbase: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(utxoTransactions)}
			{@const uniqueUtxoTransactions = [...new Map(utxoTransactions.values.map((utxoTransaction) => [utxoTransaction[EntityMetaKey.SelectorKey], utxoTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoTransactions.totalCount}
				getKey={(utxoTransaction) => utxoTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoTransaction> })}
					{@const utxoTransactionFields = { ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }}
					{@const utxoTransactionHrefFields = { ...utxoTransaction, ...utxoTransaction[EntityMetaKey.Selector] }}
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
						prefetched={utxoTransactionFields}
						href={
							(utxoTransactionHrefFields.$network !== undefined && utxoTransactionHrefFields.$network.caip2 !== undefined && utxoTransactionHrefFields.$network.caip2.namespace !== undefined && utxoTransactionHrefFields.$network !== undefined && utxoTransactionHrefFields.$network.caip2 !== undefined && utxoTransactionHrefFields.$network.caip2.reference !== undefined && utxoTransactionHrefFields.txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
								networkSlug: String(networkByCaip2[String(String(utxoTransactionHrefFields.$network.caip2.namespace) + ':' + String(utxoTransactionHrefFields.$network.caip2.reference))].slug ?? ''),
								txId: String(utxoTransactionHrefFields.txId ?? ''),
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
		entityType={EntityType.UtxoTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
