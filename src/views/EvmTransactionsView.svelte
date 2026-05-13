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
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


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


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		entityFieldReference.entityType === EntityType.EvmBlock ?
			({
				$$transactions: {
					$: [
						Source.Blockscout_Rest,
						Source.Voltaire_JsonRpc,
					],
				},
			})
		:
			({
				$$transactions: {
					$: [
						Source.Blockscout_Rest,
					],
				},
			}),
	)

	const transactions = derive(
		parentEntity,
		(merged) => (
			[...(merged.$$transactions ?? [])]
				.toSorted((a, b) => (
					stringify(b[EntityMetaKey.Id]).localeCompare(stringify(a[EntityMetaKey.Id]))
				))
				.slice(
					0,
					entityFieldReference.entityType === EntityType.EvmBlock ?
						100
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
	{#snippet Empty()}
		<p data-text="muted">
			No transactions to show for this scope yet.
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
			{:else if entityFieldReference.entityType === EntityType.Network}
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
