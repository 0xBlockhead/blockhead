<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const channelRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const channelId = rowEntityId(row)
		return (
			typeof channelId === 'object'
			&& channelId != null
			&& 'id' in channelId
			&& typeof channelId.id === 'string' ?
				channelId.id
			:
				''
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		id = 'channels',
		href = resolve('/farcaster/channels'),
		title = 'Channels',
		open = $bindable(true),
	}: {
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const farcasterNetworkParentKey = stringify({ scope: 'FarcasterNetwork' })

	const channelsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$farcasterChannels: entityFieldCollections[EntityType.FarcasterNetwork]['$$farcasterChannels']! })
				.where(({ $$farcasterChannels }) => (
					eq(
						$$farcasterChannels[EntityMetaKey.ParentIdKey],
						farcasterNetworkParentKey,
					)
				))
				.where(({ $$farcasterChannels }) => (
					eq(
						$$farcasterChannels[EntityMetaKey.Source],
						Source.Farcaster,
					)
				))
				.select(({ $$farcasterChannels }) => ({
					[EntityMetaKey.Id]: $$farcasterChannels[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterChannel}
	{id}
	{href}
	{title}
	bind:open
	query={channelsQuery}
	items={new SvelteSet(channelsQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id]) ?? ''}
	getSortValue={channelRowSortKey}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet Empty()}
		<p data-text="muted">
			No channels in collections (resolve Farcaster network `$$farcasterChannels` from Farcaster Client API).
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const channelId = rowEntityId(row)}
			{#if typeof channelId === 'object' && channelId != null && 'id' in channelId && typeof channelId.id === 'string' && channelId.id.length}
				<FarcasterChannelView
					entityId={{ id: channelId.id }}
					href={resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
						channelId: channelId.id,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
