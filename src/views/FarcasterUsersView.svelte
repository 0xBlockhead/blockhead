<script lang="ts">
	// Types/constants
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const userRowSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const userId = rowEntityId(row)
		return (
			typeof userId === 'object'
			&& userId !== undefined
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

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'users',
		href = resolve('/farcaster/users'),
		title = 'Users',
		open = $bindable(true),
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.FarcasterUser>
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$users: entityFieldCollections[EntityType.FarcasterNetwork]['$$users']! })
				.where(({ $$users }) => (
					eq(
						$$users[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ $$users }) => (
					eq(
						$$users[EntityMetaKey.Source],
						Source.Snapchain_Rest,
					)
				))
				.select(({ $$users }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error Farcaster user field row Value holds entity id
						$$users[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
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
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={userRowSortKey}
	placeholderKeys={new SvelteSet<string>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No users loaded for this network yet. Try again shortly.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const userId = rowEntityId(row)}
			{#if typeof userId === 'object' && userId !== undefined && 'fid' in userId && typeof userId.fid === 'number'}
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
