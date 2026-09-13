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
	}: EntityListViewProps<EntityType.AptosCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosCoinBalance_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				assetType: true,
				amount: true,
				ledgerVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosCoinBalanceTimestamp })}
		{@const aptosCoinBalanceTimestampSelector = aptosCoinBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = aptosCoinBalanceTimestampSelector.$account}
		<EntityView
			entityType={EntityType.AptosCoinBalance_Timestamp}
			entitySelector={aptosCoinBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/coin-balance/[storageId=stringSegment]/observation/[ledgerVersion=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.address,
						storageId: aptosCoinBalanceTimestampSelector.storageId,
						ledgerVersion: String(aptosCoinBalanceTimestampSelector.ledgerVersion),
						source: aptosCoinBalanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{aptosCoinBalanceTimestamp.assetType || 'current Aptos coin balance observation'}
			{/snippet}

			{#snippet Value()}
				{aptosCoinBalanceTimestamp.amount + aptosCoinBalanceTimestamp.unit}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosCoinBalanceTimestampSelector.ledgerVersion}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
