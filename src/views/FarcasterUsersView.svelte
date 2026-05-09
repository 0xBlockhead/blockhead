<script lang="ts">
	// Types/constants
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'
	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		id = 'users',
		href = resolve('/farcaster/users'),
		title = 'Users',
		open = $bindable(true),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
		id?: string
		href?: string
		title?: string
		open?: boolean
	} = $props()


	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					$$users: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
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
				.select(({ $$users }) => (
					{ value: $$users[EntityMetaKey.Value] }
				))
				.distinct()
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
	items={usersQuery.data?.map(({ value }) => value) ?? []}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => row[EntityMetaKey.Id].fid}
	placeholderKeys={new SvelteSet<string>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	query={{
		data: usersQuery.data?.map(({ value }) => value) ?? [],
		isLoading: usersQuery.isLoading,
		isError: usersQuery.isError,
		isReady: usersQuery.isReady,
		error: usersQuery.error,
		status: usersQuery.status,
	}}
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
			{@const userId = row[EntityMetaKey.Id]}
			<FarcasterUserView
				entityId={{ fid: userId.fid }}
				href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
					userId: String(userId.fid),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
