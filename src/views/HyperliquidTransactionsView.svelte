<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type HyperliquidTransactionsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.HyperliquidNetwork,
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
			selection: HyperliquidTransactionsResource
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
	import HyperliquidTransactionView from '$/views/HyperliquidTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.HyperliquidTransaction}
	{title}
	bind:open
	{id}
	{href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Hyperliquid transactions here are HyperEVM execution transactions resolved through JSON-RPC blocks.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary {resource} placeholderText="Loading transactions…">
				{#snippet children(transactions)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.HyperliquidTransaction}
				id={`${id}-items`}
				{href}
				getKey={(transaction) => stringify(transaction.entitySelector)}
				getSortValue={(transaction) => stringify(transaction.entitySelector)}
				open={true}
				items={transactions.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No recent transactions yet.</p>
				{/snippet}

				{#snippet Item({ item })}
					<HyperliquidTransactionView
						selector={item.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
