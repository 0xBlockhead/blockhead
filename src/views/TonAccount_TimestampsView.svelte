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
	}: EntityListViewProps<EntityType.TonAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonAccount_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					balanceNano: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: tonAccountTimestamp })}
		{@const tonAccountTimestampSelector = tonAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = tonAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.TonAccount_Timestamp}
			entitySelector={tonAccountTimestampSelector}
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
						accountId: account.address,
						timestampMs: String(tonAccountTimestampSelector.timestampMs),
						source: tonAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{String(tonAccountTimestamp.balanceNano ?? '') || 'TON account timestamp'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tonAccountTimestamp.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
