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
		title = 'Actors',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.AtprotoActor>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const actorsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					actorFieldRow: entityFieldCollections[EntityType.AtprotoNetwork]['$$atprotoActors']!,
				})
				.where(({ actorFieldRow }) => (
					eq(
						actorFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ actorFieldRow }) => (
					eq(
						actorFieldRow[EntityMetaKey.Source],
						Source.Atproto_Xrpc,
					)
				))
				.select(({ actorFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						actorFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoActor}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		typeof row[EntityMetaKey.Id] === 'object'
		&& row[EntityMetaKey.Id] !== undefined
		&& 'did' in row[EntityMetaKey.Id]
		&& typeof row[EntityMetaKey.Id].did === 'string' ?
			row[EntityMetaKey.Id].did
		:	''
	)}
	items={new SvelteSet(actorsQuery.data ?? [])}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={actorsQuery}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No AT Protocol actors to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			{@const actorId = item[EntityMetaKey.Id]}
			{#if typeof actorId === 'object' && actorId !== undefined && 'did' in actorId && typeof actorId.did === 'string'}
				<AtprotoActorView
					entityId={{ did: actorId.did }}
					href={resolve('/(social)/atproto/actor/[did]', {
						did: encodeURIComponent(actorId.did),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
