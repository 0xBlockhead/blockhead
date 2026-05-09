<script lang="ts">
	// Types/constants
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
		href,
		id,
		open = $bindable(true),
		title = 'Users',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.XUser>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					userFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
				.where(({ userFieldRow }) => (
					eq(
						userFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ userFieldRow }) => (
					eq(
						userFieldRow[EntityMetaKey.Source],
						Source.X_Rest,
					)
				))
				.select(({ userFieldRow }) => (
					{ value: userFieldRow[EntityMetaKey.Value] }
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
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntitiesList
	entityType={EntityType.XUser}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].id
	)}
	items={usersQuery.data?.map(({ value }) => value) ?? []}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: usersQuery.data?.map(({ value }) => value) ?? [],
		isLoading: usersQuery.isLoading,
		isError: usersQuery.isError,
		isReady: usersQuery.isReady,
		error: usersQuery.error,
		status: usersQuery.status,
	}}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No X users to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			{@const userId = item[EntityMetaKey.Id]}
			<XUserView
				entityId={{ id: userId.id }}
				href={resolve('/(social)/x/user/[userId]', {
					userId: encodeURIComponent(userId.id),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
