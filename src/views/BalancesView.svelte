<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Balances',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetworkActorCoinBalance>
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
	data-entity-field-name={entityFieldReference.fieldName}
	data-entity-field-type={entityFieldReference.entityType}
	data-entity-field-parent={stringify(entityFieldReference.entityId)}
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Allium_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						sources: [
							Source.Allium_Rest,
						],
					},
				} }),
			)}
			<ResourceBoundary
				resource={parent}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmNetworkActorCoinBalance}
						{title}
						open={true}
						data-entity-field-name={entityFieldReference.fieldName}
						data-entity-field-type={entityFieldReference.entityType}
						data-entity-field-parent={stringify(entityFieldReference.entityId)}
						getKey={(evmNetworkActorCoinBalance) => stringify(evmNetworkActorCoinBalance[EntityMetaKey.Id])}
						placeholderKeys={new SvelteSet<string>()}
						placeholderText={`Loading ${title.toLowerCase()}…`}
						items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No balances for this wallet yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<EvmNetworkActorCoinBalanceView
								entityId={item[EntityMetaKey.Id]}
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
