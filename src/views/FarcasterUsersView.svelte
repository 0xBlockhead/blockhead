<script lang="ts">
	// Types/constants
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const userRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const userId = rowEntityId(row)
		return (
			typeof userId === 'object'
			&& userId != null
			&& 'fid' in userId
			&& typeof userId.fid === 'number' ?
				userId.fid
			:
				0
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'


	// Props
	let {
		id = 'users',
		href = resolve('/farcaster/users'),
		title = 'Users',
		open = $bindable(true),
	}: {
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const farcasterNetworkParentKey = stringify({ scope: 'FarcasterNetwork' })

	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$farcasterUsers: entityFieldCollections[EntityType.FarcasterNetwork]['$$farcasterUsers']! })
				.where(({ $$farcasterUsers }) => (
					eq(
						$$farcasterUsers[EntityMetaKey.ParentIdKey],
						farcasterNetworkParentKey,
					)
				))
				.where(({ $$farcasterUsers }) => (
					eq(
						$$farcasterUsers[EntityMetaKey.Source],
						Source.Snapchain,
					)
				))
				.select(({ $$farcasterUsers }) => ({
					[EntityMetaKey.Id]: $$farcasterUsers[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterUser}
	{id}
	{href}
	{title}
	bind:open
	query={usersQuery}
	items={new SvelteSet(usersQuery.data ?? [])}
	getKey={(row) => stringify(row[EntityMetaKey.Id]) ?? ''}
	getSortValue={userRowSortKey}
	placeholderKeys={new SvelteSet<string>()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No users in collections (resolve Farcaster network `$$farcasterUsers` from Snapchain).
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const userId = rowEntityId(row)}
			{#if typeof userId === 'object' && userId != null && 'fid' in userId && typeof userId.fid === 'number'}
				<FarcasterUserView
					entityId={{ fid: userId.fid }}
					href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
						userId: String(userId.fid),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
