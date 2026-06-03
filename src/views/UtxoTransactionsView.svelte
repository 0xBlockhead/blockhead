<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Transactions',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.UtxoTransaction>
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Blockchair_Rest,
							Source.Esplora_Rest,
							Source.MempoolSpace_Rest,
							Source.BitcoinCore_JsonRpc,
							Source.LitecoinCore_JsonRpc,
							Source.DogecoinCore_JsonRpc,
							Source.BitcoinCashNode_JsonRpc,
							Source.Zcashd_JsonRpc,
						],
						$limit: 16,
					},
				},
			)}
			{@const transactions = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.UtxoTransaction>[] => (
					(parent[entityFieldReference.fieldName] ?? []).slice(0, 16)
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.UtxoTransaction}
				id={`${id}-items`}
				href={href}
				getKey={(transaction) => stringify(transaction[EntityMetaKey.Id])}
				getSortValue={(transaction) => stringify(transaction[EntityMetaKey.Id])}
				open={true}
				resource={transactions}
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
						entityId={context!.item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
