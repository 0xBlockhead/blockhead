<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Bridge transactions',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BridgeTransaction>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BridgeTransaction}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row records origin-side proof you initiated a cross-chain transfer: account, source chain, and source transaction hash.
		</p>
		<p>
			Bridging is usually multi-step: a source-chain transaction locks or burns funds, then relays or light clients justify a release mint on the destination.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridge transactions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText="Loading bridge transactions…">
				{#snippet children(bridgeTransactions)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BridgeTransaction}
				{title}
				open={true}
				items={bridgeTransactions.entities}
				getKey={(bridgeTransaction) => stringify(bridgeTransaction.entitySelector)}
				getSortValue={(bridgeTransaction) => `${String(bridgeTransaction.entitySelector.createdAt)}\0${stringify(bridgeTransaction.entitySelector)}`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridge transactions yet.
					</p>
				{/snippet}

				{#snippet Item({ item: bridgeTransaction })}
					<BridgeTransactionView
						selection={select(EntityType.BridgeTransaction, bridgeTransaction.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
