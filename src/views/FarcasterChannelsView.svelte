<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.FarcasterChannel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterChannel}
	bind:open
	resource={
		selection({
			fields: {
				id: true,
				parentUrl: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterChannel })}
		{@const farcasterChannelSelector = farcasterChannel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterChannel}
			entitySelector={farcasterChannelSelector}
			href={
				farcasterChannelSelector.id !== undefined ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
						{
							channelId: farcasterChannelSelector.id,
						}
					)
				:
					farcasterChannelSelector.parentUrl !== undefined ?
						resolve(
							'/farcaster/channel/parent/[parentUrl=stringSegment]',
							{
								parentUrl: farcasterChannelSelector.parentUrl,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{farcasterChannel.id || 'Farcaster channel'}
			{/snippet}

			{#snippet Value()}
				{farcasterChannel.parentUrl}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{farcasterChannel.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
