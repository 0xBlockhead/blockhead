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
	}: EntityListViewProps<EntityType.EigenLayerReward_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerReward_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$earner: true,
				rewardContextKey: true,
				rewardToken: true,
			},
		})
	}
>
	{#snippet Item({ item: eigenLayerRewardTimestamp })}
		{@const eigenLayerRewardTimestampSelector = eigenLayerRewardTimestamp[EntityMetaKey.Selector]}
		{@const earner = eigenLayerRewardTimestampSelector.$earner}
		<EntityView
			entityType={EntityType.EigenLayerReward_Timestamp}
			entitySelector={eigenLayerRewardTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/eigenlayer/reward/[rewardContextKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							earner.$network.caip2 !== undefined ?
								caip2StringFromValue(earner.$network.caip2)
							:
								earner.$network.slug
						),
						accountId: earner.$actor.address,
						rewardContextKey: eigenLayerRewardTimestampSelector.rewardContextKey,
						timestampMs: String(eigenLayerRewardTimestampSelector.timestampMs),
						source: eigenLayerRewardTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{eigenLayerRewardTimestampSelector.$earner.$actor.address || 'EVM account'}
			{/snippet}

			{#snippet Value()}
				{eigenLayerRewardTimestampSelector.rewardContextKey}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eigenLayerRewardTimestamp.rewardToken ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
