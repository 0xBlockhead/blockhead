<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Transactions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadBridgeTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadBridgeTransaction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				createdAt: true,
				$sourceTx: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadBridgeTransaction })}
		{@const blockheadBridgeTransactionSelector = blockheadBridgeTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadBridgeTransaction}
			entitySelector={blockheadBridgeTransactionSelector}
			href={
				(
					'caip2' in blockheadBridgeTransactionSelector.$sourceTx.$network ?
						resolve(
							'/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
							{
								chainId: String(blockheadBridgeTransactionSelector.$sourceTx.$network.caip2.reference),
								address: String(blockheadBridgeTransactionSelector.$account.address),
								sourceTxHash: encodeURIComponent(String(blockheadBridgeTransactionSelector.$sourceTx.txHash)),
								createdAt: String(blockheadBridgeTransactionSelector.createdAt),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{String(blockheadBridgeTransactionSelector.createdAt) || 'bridge transaction'}
			{/snippet}

			{#snippet Value()}
				{blockheadBridgeTransactionSelector.$sourceTx.txHash || 'EVM transaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadBridgeTransactionSelector.$account.address) || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
