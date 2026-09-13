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
		title = 'Routing policies',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LightningChannelRoutingPolicy_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningChannelRoutingPolicy_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$towardNode: true,
				feeRatePpm: true,
				disabled: true,
			},
		})
	}
>
	{#snippet Item({ item: lightningChannelRoutingPolicyTimestamp })}
		{@const lightningChannelRoutingPolicyTimestampSelector = lightningChannelRoutingPolicyTimestamp[EntityMetaKey.Selector]}
		{@const channelTimestamp = lightningChannelRoutingPolicyTimestampSelector.$channelTimestamp}
		<EntityView
			entityType={EntityType.LightningChannelRoutingPolicy_Timestamp}
			entitySelector={lightningChannelRoutingPolicyTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(lightningChannelTimestamp)/routing-policy/[publicKey=stringSegment]',
					{
						network: (
							channelTimestamp.$channel.$network.caip2 !== undefined ?
								caip2StringFromValue(channelTimestamp.$channel.$network.caip2)
							:
								channelTimestamp.$channel.$network.slug
						),
						channelId: channelTimestamp.$channel.channelId,
						timestampMs: String(channelTimestamp.timestampMs),
						source: channelTimestamp.source,
						publicKey: lightningChannelRoutingPolicyTimestampSelector.$towardNode.publicKey,
					}
				)
			}
		>
			{#snippet Title()}
				{lightningChannelRoutingPolicyTimestampSelector.$towardNode.publicKey || 'Lightning public node'}
			{/snippet}

			{#snippet Value()}
				{[String(lightningChannelRoutingPolicyTimestamp.feeRatePpm ?? ''), String(lightningChannelRoutingPolicyTimestamp.disabled ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
