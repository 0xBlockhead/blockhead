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
		title = 'Blockhead Litecoin MWEB wallet state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLitecoinMwebWalletState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					balanceLitoshis: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebWalletStateTimestamp })}
		{@const blockheadLitecoinMwebWalletStateTimestampSelector = blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.Selector]}
		{@const walletState = blockheadLitecoinMwebWalletStateTimestampSelector.$walletState}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
			entitySelector={blockheadLitecoinMwebWalletStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/litecoin-mweb/wallet/[walletId=stringSegment]/state/(blockheadLitecoinMwebWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in walletState.$network ?
								caip2StringFromValue(walletState.$network.caip2)
							:
								walletState.$network.slug
						),
						walletId: walletState.walletId,
						timestampMs: String(blockheadLitecoinMwebWalletStateTimestampSelector.timestampMs),
						source: blockheadLitecoinMwebWalletStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebWalletStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebWalletStateTimestamp.balanceLitoshis ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLitecoinMwebWalletStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
