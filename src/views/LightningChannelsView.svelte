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
	}: EntityListViewProps<EntityType.LightningChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LightningChannel}
	bind:open
	resource={
		selection({
			...{
				fields: {
					shortChannelId: true,
					$node1: true,
					channelId: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: lightningChannel })}
		{@const lightningChannelSelector = lightningChannel[EntityMetaKey.Selector]}
		{@const network = lightningChannelSelector.$network}
		<EntityView
			entityType={EntityType.LightningChannel}
			entitySelector={lightningChannelSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						channelId: lightningChannelSelector.channelId,
					}
				)
			}
		>
			{#snippet Title()}
				{(lightningChannel.shortChannelId ?? '') || lightningChannelSelector.channelId || 'Lightning channel'}
			{/snippet}

			{#snippet Value()}
				{lightningChannel.$node1 == null ? '' : lightningChannel.$node1.publicKey || 'Lightning public node'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
