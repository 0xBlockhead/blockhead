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
	}: EntityListViewProps<EntityType.FarcasterFeed> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FarcasterFeed}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				variant: true,
			},
		})
	}
>
	{#snippet Item({ item: farcasterFeed })}
		{@const farcasterFeedSelector = farcasterFeed[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FarcasterFeed}
			entitySelector={farcasterFeedSelector}
			href={
				farcasterFeedSelector.variant === 'byUser'
				&& farcasterFeedSelector.fid !== undefined ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]',
						{
							userId: String(farcasterFeedSelector.fid),
						}
					)
				:
					farcasterFeedSelector.variant === 'byChannel'
					&& farcasterFeedSelector.channelId !== undefined ?
						resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]',
							{
								channelId: farcasterFeedSelector.channelId,
							}
						)
					:
						farcasterFeedSelector.variant === 'following'
						&& farcasterFeedSelector.viewerFid !== undefined ?
							resolve(
								'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
								{
									userId: String(farcasterFeedSelector.viewerFid),
								}
							)
						:
							farcasterFeedSelector.variant === 'trending' ?
								resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/trending')
							:
								undefined
			}
		>
			{#snippet Title()}
				{[farcasterFeed.label, farcasterFeedSelector.variant].filter(Boolean).join(' ') || 'Farcaster feed'}
			{/snippet}

			{#snippet Value()}
				{farcasterFeedSelector.variant}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
