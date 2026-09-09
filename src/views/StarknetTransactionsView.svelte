<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionHash: true,
				transactionKind: true,
				$block: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetTransaction })}
		{@const starknetTransactionSelector = starknetTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetTransaction}
			entitySelector={starknetTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]',
					{
						network: (
							'caip2' in starknetTransactionSelector.$network.$network ?
								caip2StringFromValue(starknetTransactionSelector.$network.$network.caip2)
							:
								starknetTransactionSelector.$network.$network.slug
						),
						transactionHash: starknetTransactionSelector.transactionHash,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetTransactionSelector.transactionHash || 'starknet transaction'}
			{/snippet}

			{#snippet Value()}
				{starknetTransaction.transactionKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetTransaction.$block == null ? '' : String(starknetTransaction.$block.blockNumber) || 'starknet block'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
