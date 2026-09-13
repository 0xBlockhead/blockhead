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
	}: EntityListViewProps<EntityType.StarknetAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$contract: true,
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetAccountTimestamp })}
		{@const starknetAccountTimestampSelector = starknetAccountTimestamp[EntityMetaKey.Selector]}
		{@const contract = starknetAccountTimestampSelector.$contract}
		<EntityView
			entityType={EntityType.StarknetAccount_Timestamp}
			entitySelector={starknetAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/starknet-block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							contract.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						accountId: contract.address,
						blockNumber: String(starknetAccountTimestampSelector.blockNumber),
						source: starknetAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetAccountTimestampSelector.$contract.address || 'starknet contract'}
			{/snippet}

			{#snippet Value()}
				{starknetAccountTimestampSelector.blockNumber}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetAccountTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
