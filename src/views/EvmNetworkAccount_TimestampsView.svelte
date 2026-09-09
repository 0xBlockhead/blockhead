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
	}: EntityListViewProps<EntityType.EvmNetworkAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				transactionCount: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkAccountTimestamp })}
		{@const evmNetworkAccountTimestampSelector = evmNetworkAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = evmNetworkAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.EvmNetworkAccount_Timestamp}
			entitySelector={evmNetworkAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.$actor.address,
						timestampMs: String(evmNetworkAccountTimestampSelector.timestampMs),
						source: evmNetworkAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{evmNetworkAccountTimestampSelector.$account.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkAccountTimestamp.transactionCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkAccountTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
