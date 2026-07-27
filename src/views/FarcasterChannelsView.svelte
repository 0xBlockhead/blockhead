<!-- Generated from APP.ts. Do not edit by hand. -->

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
				$icon: true,
				name: true,
				id: true,
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
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
					{
						channelId: String(farcasterChannelSelector.id),
					}
				)
			}
		>
			{#snippet Title()}
				{[farcasterChannel.name, farcasterChannelSelector.id].filter(Boolean).join(' ') || 'Farcaster channel'}
			{/snippet}

			{#snippet Value()}
				{farcasterChannelSelector.id}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(farcasterChannel.createdAt ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
