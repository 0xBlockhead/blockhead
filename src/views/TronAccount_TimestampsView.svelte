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
	}: EntityListViewProps<EntityType.TronAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccount_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$account: true,
					balanceSun: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: tronAccountTimestamp })}
		{@const tronAccountTimestampSelector = tronAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = tronAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.TronAccount_Timestamp}
			entitySelector={tronAccountTimestampSelector}
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
						timestampMs: String(tronAccountTimestampSelector.timestampMs),
						source: tronAccountTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{tronAccountTimestampSelector.$account.address || 'tron account'}
			{/snippet}

			{#snippet Value()}
				{tronAccountTimestamp.balanceSun ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String(tronAccountTimestampSelector.timestampMs), tronAccountTimestampSelector.source].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
