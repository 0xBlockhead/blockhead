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
	}: EntityListViewProps<EntityType.TronAccountTokenBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronAccountTokenBalance_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				tokenSymbol: true,
				balance: true,
				tokenName: true,
				tokenId: true,
				$account: true,
			},
		})
	}
>
	{#snippet Item({ item: tronAccountTokenBalanceTimestamp })}
		{@const tronAccountTokenBalanceTimestampSelector = tronAccountTokenBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = tronAccountTokenBalanceTimestampSelector.$account}
		<EntityView
			entityType={EntityType.TronAccountTokenBalance_Timestamp}
			entitySelector={tronAccountTokenBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							account.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						tokenId: tronAccountTokenBalanceTimestampSelector.$token.tokenId,
						timestampMs: String(tronAccountTokenBalanceTimestampSelector.timestampMs),
						source: tronAccountTokenBalanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{(tronAccountTokenBalanceTimestamp.tokenSymbol ?? '') || [(tronAccountTokenBalanceTimestamp.tokenName ?? ''), (tronAccountTokenBalanceTimestamp.tokenId ?? '')].filter(Boolean).join(' ') || 'tron account token balance timestamp'}
			{/snippet}

			{#snippet Value()}
				{tronAccountTokenBalanceTimestamp.balance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tronAccountTokenBalanceTimestampSelector.$account.address || 'tron account'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
