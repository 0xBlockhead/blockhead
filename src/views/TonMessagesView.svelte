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
	}: EntityListViewProps<EntityType.TonMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonMessage}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonMessage })}
		{@const tonMessageSelector = tonMessage[EntityMetaKey.Selector]}
		{@const network = tonMessageSelector.$network}
		{@const sourceTransaction = tonMessageSelector.$sourceTransaction}
		<EntityView
			entityType={EntityType.TonMessage}
			entitySelector={tonMessageSelector}
			href={
				'outIndex' in tonMessageSelector
				&& '$sourceTransaction' in tonMessageSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/transaction/[lt=nonNegativeBigInt]/(tonTransaction)/message/[outIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in sourceTransaction.$account.$network ?
									caip2StringFromValue(sourceTransaction.$account.$network.caip2)
								:
									sourceTransaction.$account.$network.slug
							),
							accountId: sourceTransaction.$account.address,
							lt: String(sourceTransaction.lt),
							outIndex: String(tonMessageSelector.outIndex),
						}
					)
				:
					'messageHash' in tonMessageSelector
					&& '$network' in tonMessageSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								messageHash: tonMessageSelector.messageHash,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				TON message
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
