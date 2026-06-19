<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type SolanaTransactionsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.SolanaNetwork,
		'$$transactions'
	>
	// State
	let {
		selection,
		title = 'Transactions',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: SolanaTransactionsResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.SolanaTransaction}
	{title}
	bind:open
	{id}
	{href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Solana transactions bundle signatures and SVM instructions executed in a slot.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading transactions…">
				{#snippet children(transactions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.SolanaTransaction}
						id={`${id}-items`}
						{href}
						getKey={(transaction) => stringify(transaction.entitySelector)}
						getSortValue={(transaction) => stringify(transaction.entitySelector)}
						open={true}
						items={transactions.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No recent transactions yet.</p>
						{/snippet}

						{#snippet Item({ item })}
							<SolanaTransactionView
								selection={select(EntityType.SolanaTransaction, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
