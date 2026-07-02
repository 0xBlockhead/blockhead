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
		placeholderText = 'Loading Solana transactions...',
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
			selection.sources == null ? selection({
				fields: {
					signature: true,
					status: true,
				},
			}) : selection
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
				totalCount={solanaTransactions.values.length === uniqueSolanaTransactions.length && solanaTransactions.totalCount != null && solanaTransactions.totalCount >= uniqueSolanaTransactions.length ? solanaTransactions.totalCount : uniqueSolanaTransactions.length}
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
					<SolanaTransactionView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]', {
								networkSlug: String(({ ...solanaTransaction.entitySelector, ...solanaTransaction }).$network.slug),
								signature: String(({ ...solanaTransaction.entitySelector, ...solanaTransaction }).signature),
							})
						}
						selection={select(EntityType.SolanaTransaction, solanaTransaction.entitySelector)}
						prefetched={solanaTransaction}
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
