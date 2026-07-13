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
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaTransaction>
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
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
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
					signature: true,
					status: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaTransactions)}
			{@const uniqueSolanaTransactions = [...new Map(solanaTransactions.values.map((solanaTransaction) => [solanaTransaction[EntityMetaKey.SelectorKey], solanaTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaTransactions.totalCount}
				getKey={(solanaTransaction) => solanaTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaTransaction> })}
					{@const solanaTransactionFields = { ...solanaTransaction[EntityMetaKey.Selector], ...solanaTransaction }}
					{@const solanaTransactionHrefFields = { ...solanaTransaction, ...solanaTransaction[EntityMetaKey.Selector] }}
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, solanaTransaction[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaTransactionFields}
						href={
							(solanaTransactionHrefFields.$network !== undefined && solanaTransactionHrefFields.$network.slug !== undefined && solanaTransactionHrefFields.signature !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								network: String(solanaTransactionHrefFields.$network.slug ?? ''),
								transactionId: String(solanaTransactionHrefFields.signature ?? ''),
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
		entityType={EntityType.SolanaTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
