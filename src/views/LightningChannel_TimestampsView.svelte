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
	}: EntityListViewProps<EntityType.LightningChannel_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningChannel_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					capacitySats: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: lightningChannelTimestamp })}
		{@const lightningChannelTimestampSelector = lightningChannelTimestamp[EntityMetaKey.Selector]}
		{@const channel = lightningChannelTimestampSelector.$channel}
		<EntityView
			entityType={EntityType.LightningChannel_Timestamp}
			entitySelector={lightningChannelTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]/(lightningChannel)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in channel.$network ?
								caip2StringFromValue(channel.$network.caip2)
							:
								channel.$network.slug
						),
						channelId: channel.channelId,
						timestampMs: String(lightningChannelTimestampSelector.timestampMs),
						source: lightningChannelTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{lightningChannelTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(lightningChannelTimestamp.status ?? ''), String(lightningChannelTimestamp.capacitySats ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
