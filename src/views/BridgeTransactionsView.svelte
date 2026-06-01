<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type BridgeTxRow = {
		value: Entity<typeof schema, EntityType.BridgeTransaction>
	}


	// State
	let {
		entityFieldReference,
		title = 'Bridge transactions',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BridgeTransaction>
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const bridgeTransactions = derive(
				parent,
				(parent): BridgeTxRow[] => {
					const bridgeTransactions: Entity<typeof schema, EntityType.BridgeTransaction>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						bridgeTransactions.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BridgeTransaction}
				{title}
				open={true}
				resource={bridgeTransactions}
				placeholderText="Loading bridge transactions…"
				getKey={(row) => stringify(bridgeTransaction.value[EntityMetaKey.Id])}
				getSortValue={(row) => (
					`${String(bridgeTransaction.value[EntityMetaKey.Id].createdAt)}\0${stringify(bridgeTransaction.value[EntityMetaKey.Id])}`
				)}
				placeholderKeys={new SvelteSet<string | number>()}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridge transactions yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: bridgeTransaction,
				})}
					{@const id = bridgeTransaction.value[EntityMetaKey.Id]}
					<BridgeTransactionView
						entityId={id}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
