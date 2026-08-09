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
	}: EntityListViewProps<EntityType.TezosTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosTokenTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosTokenTransfer })}
		{@const tezosTokenTransferSelector = tezosTokenTransfer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosTokenTransfer}
			entitySelector={tezosTokenTransferSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token-transfer/[transferId=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in tezosTokenTransferSelector.$network.$network ?
								caip2StringFromValue(tezosTokenTransferSelector.$network.$network.caip2)
							:
								tezosTokenTransferSelector.$network.$network.slug
						),
						transferId: tezosTokenTransferSelector.transferId,
						source: tezosTokenTransferSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
