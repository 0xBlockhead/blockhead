<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Balances',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetworkActorCoinBalance}
	{title}
	bind:open
	{collapsible}
	data-entity-field-name={selection.fieldName}
	data-entity-field-type={selection.entityType}
	data-entity-field-parent={stringify(selection.entitySelector)}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Token balances are indexed holdings for this address on a given execution-layer network.
		</p>
		<p>
			Consensus-layer validator balances and attestation rewards live on the beacon chain, not in ERC-20 style token balance tables.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No balances for this wallet yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Allium_Rest],
					})}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(balances)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmNetworkActorCoinBalance}
						{title}
						open={true}
						data-entity-field-name={selection.fieldName}
						data-entity-field-type={selection.entityType}
						data-entity-field-parent={stringify(selection.entitySelector)}
						getKey={(evmNetworkActorCoinBalance) => stringify(evmNetworkActorCoinBalance.entitySelector)}
						placeholderKeys={new SvelteSet<string>()}
						placeholderText={`Loading ${title.toLowerCase()}…`}
						items={balances.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No balances for this wallet yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<EvmNetworkActorCoinBalanceView
								selection={select(EntityType.EvmNetworkActorCoinBalance, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
