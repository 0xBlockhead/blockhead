<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		title = 'Transactions',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmTransaction
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	{title}
	bind:open
	{collapsible}	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution payloads included in a block or sitting in the mempool: gas fields, type (legacy/EIP-1559/blob), and logs follow that network’s rules.
		</p>
		<p>
			Receipts add cumulative gas used, contract status, and receipt logs—full detail is only available once the tx is mined and indexed.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No transactions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				entityFieldReference.entityType === EntityType.EvmBlock ?
					{
						[entityFieldReference.fieldName]: {
							$: [
								Source.Blockscout_Rest,
								Source.Voltaire_JsonRpc,
							],
							$limit: 16,
						},
					}
				:
					{
						[entityFieldReference.fieldName]: {
							$: [
								Source.Blockscout_Rest,
							],
							$limit: 16,
						},
					},
			)}
			{@const transactions = derive(
				parent,
				(parent) => (
					[...(parent[entityFieldReference.fieldName] ?? [])]
						.slice(
							0,
							entityFieldReference.entityType === EntityType.EvmBlock ?
								100
							:
							entityFieldReference.entityType === EntityType.ActorNetwork ?
								32
							:
								8,
						)
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTransaction}
				getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
				getSortValue={(line) => (
					line.value.transactionIndex !== undefined ?
						-line.value.transactionIndex
					:
						stringify(line.value[EntityMetaKey.Id])
				)}
				placeholderText="Loading transactions…"
				resource={transactions}
				{title}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No transactions yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const t = line[EntityMetaKey.Id]}
					{#if entityFieldReference.entityType === EntityType.EvmBlock}
						<!-- href override: tx detail under block route, not network /transactions/tx -->
						<EvmTransactionView
							entityId={t}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]/(block)/(transactions)/tx/[transactionId]',
								{
										...caip2RouteParamsFromEvmChainId(entityFieldReference.entityId.$network.chainId),
										blockNumber: String(
											entityFieldReference.entityId.blockNumber,
										),
										transactionId: t.txHash,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							showListInputSelector
						/>
					{:else if entityFieldReference.entityType === EntityType.EvmNetwork || entityFieldReference.entityType === EntityType.ActorNetwork}
						<EvmTransactionView
							entityId={t}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							showListInputSelector
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
