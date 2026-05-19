<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Transactions',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.EvmTransaction
			>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		entityFieldReference.entityType === EntityType.EvmBlock ?
			(
				open ?
					{
						$$transactions: {
							$: [
								Source.Blockscout_Rest,
								Source.Voltaire_JsonRpc,
							],
						},
					}
				:
					{}
			)
		:
			(
				open ?
					{
						$$transactions: {
							$: [
								Source.Blockscout_Rest,
							],
						},
					}
				:
					{}
			),
	)

	const transactions = derive(
		parent,
		(parent) => (
			[...(parent.$$transactions ?? [])]
				.toSorted((a, b) => (
					stringify(b[EntityMetaKey.Id]).localeCompare(stringify(a[EntityMetaKey.Id]))
				))
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
	)
</script>


<EntitiesList
	entityType={EntityType.EvmTransaction}
	getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
	placeholderText="Loading transactions…"
	resource={transactions}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	bind:open
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Signed execution payloads included in a block or sitting in the mempool: gas fields, type (legacy/EIP-1559/blob), and logs follow that network’s rules.
		</p>
		<p>
			Receipts add cumulative gas used, contract status, and event logs—full detail is only available once the tx is mined and indexed.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No transactions yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const line = props.item.value}
			{@const t = line[EntityMetaKey.Id]}
			{#if entityFieldReference.entityType === EntityType.EvmBlock}
				<EvmTransactionView
					entityId={t}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]/(block)/(transactions)/tx/[transactionId]',
						{
							networkId: String(
								entityFieldReference.entityId.$network.chainId,
							),
							blockNumber: String(
								entityFieldReference.entityId.blockNumber,
							),
							transactionId: t.txHash,
						},
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{:else if entityFieldReference.entityType === EntityType.Network || entityFieldReference.entityType === EntityType.ActorNetwork}
				<EvmTransactionView
					entityId={t}
					href={resolve(
						'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
						{
							networkId: String(
								t.$network.chainId,
							),
							transactionId: t.txHash,
						},
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
