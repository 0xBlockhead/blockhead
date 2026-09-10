<!-- Generated from APP.ts. -->

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
		{@const sourceTx = blockheadBridgeTransactionSelector.$sourceTx}
		<EntityView
			entityType={EntityType.BlockheadBridgeTransaction}
			entitySelector={blockheadBridgeTransactionSelector}
			href={
				'caip2' in sourceTx.$network ?
					resolve(
						'/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
						{
							chainId: sourceTx.$network.caip2.reference,
							address: blockheadBridgeTransactionSelector.$account.address,
							sourceTxHash: encodeURIComponent(sourceTx.txHash),
							createdAt: String(blockheadBridgeTransactionSelector.createdAt),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{blockheadBridgeTransactionSelector.createdAt}
			{/snippet}

			{#snippet Value()}
				{blockheadBridgeTransactionSelector.$sourceTx.txHash || 'EVM transaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadBridgeTransactionSelector.$account.address || 'EVM account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
