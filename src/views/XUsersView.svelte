<script lang="ts">
	// Types/constants
	import { type EntityFieldReference } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'Users',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.XUser>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					userFieldRow: entityFieldCollections[EntityType.XNetwork]['$$xUsers']!,
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
				.select(({ userFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						userFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
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
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntitiesList
	entityType={EntityType.XUser}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		typeof row[EntityMetaKey.Id] === 'object'
		&& row[EntityMetaKey.Id] !== undefined
		&& 'id' in row[EntityMetaKey.Id]
		&& typeof row[EntityMetaKey.Id].id === 'string' ?
			row[EntityMetaKey.Id].id
		:	''
	)}
	items={new SvelteSet(usersQuery.data ?? [])}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={usersQuery}
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
			{#if typeof userId === 'object' && userId !== undefined && 'id' in userId && typeof userId.id === 'string'}
				<XUserView
					entityId={{ id: userId.id }}
					href={resolve('/(social)/x/user/[userId]', {
						userId: encodeURIComponent(userId.id),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
