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
	}: EntityListViewProps<EntityType.TonJettonTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJettonTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJettonTransfer })}
		{@const tonJettonTransferSelector = tonJettonTransfer[EntityMetaKey.Selector]}
		{@const network = tonJettonTransferSelector.$network}
		<EntityView
			entityType={EntityType.TonJettonTransfer}
			entitySelector={tonJettonTransferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/jetton-transfer/[transferId=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transferId: tonJettonTransferSelector.transferId,
						source: tonJettonTransferSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON jetton transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
