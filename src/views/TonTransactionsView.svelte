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
	}: EntityListViewProps<EntityType.TonTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTransaction })}
		{@const tonTransactionSelector = tonTransaction[EntityMetaKey.Selector]}
		{@const account = tonTransactionSelector.$account}
		<EntityView
			entityType={EntityType.TonTransaction}
			entitySelector={tonTransactionSelector}
			href={
				tonTransactionSelector.hash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/[hash=stringSegment]',
						{
							network: (
								account.$network.caip2 !== undefined ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.address,
							lt: String(tonTransactionSelector.lt),
							hash: tonTransactionSelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]',
						{
							network: (
								account.$network.caip2 !== undefined ?
									caip2StringFromValue(account.$network.caip2)
								:
									account.$network.slug
							),
							accountId: account.address,
							lt: String(tonTransactionSelector.lt),
						}
					)
			}
		>
			{#snippet Title()}
				TON transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
