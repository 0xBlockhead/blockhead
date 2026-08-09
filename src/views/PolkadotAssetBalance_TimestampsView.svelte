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
		title = 'Asset balance observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAssetBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$asset: true,
					freeBalancePlancks: true,
					status: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: polkadotAssetBalanceTimestamp })}
		{@const polkadotAssetBalanceTimestampSelector = polkadotAssetBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = polkadotAssetBalanceTimestampSelector.$account}
		{@const asset = polkadotAssetBalanceTimestampSelector.$asset}
		<EntityView
			entityType={EntityType.PolkadotAssetBalance_Timestamp}
			entitySelector={polkadotAssetBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/asset/[assetKind=stringSegment]/[assetId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.accountId,
						assetKind: asset.assetKind,
						assetId: asset.assetId,
						timestampMs: String(polkadotAssetBalanceTimestampSelector.timestampMs),
						source: polkadotAssetBalanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotAssetBalanceTimestampSelector.$asset.assetId || 'Polkadot asset'}
			{/snippet}

			{#snippet Value()}
				{polkadotAssetBalanceTimestamp.freeBalancePlancks ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAssetBalanceTimestamp.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
