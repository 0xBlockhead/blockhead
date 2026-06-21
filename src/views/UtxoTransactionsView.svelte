<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
		import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type UtxoTransactionsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.UtxoNetwork,
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
			selection: UtxoTransactionsResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.UtxoTransaction}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			UTXO transactions consume previous outputs as inputs and create new outputs that can be spent later.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading transactions…"
			>
				{#snippet children(transactions)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.UtxoTransaction}
				id={`${id}-items`}
				href={href}
				getKey={(transaction) => stringify(transaction.entitySelector)}
				getSortValue={(transaction) => stringify(transaction.entitySelector)}
				open={true}
				items={transactions.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent transactions yet.
					</p>
				{/snippet}

				{#snippet Item(context)}
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, context!.item.entitySelector)}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
