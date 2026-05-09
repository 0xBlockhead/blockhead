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
		title = 'Actors',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoActor>
		href: string
		id: string
		open?: boolean
		title?: string
	} = $props()


	const actorsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					actorFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
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
				.select(({ actorFieldRow }) => (
					{ value: actorFieldRow[EntityMetaKey.Value] }
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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoActor}
	{href}
	{id}
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].did
	)}
	items={actorsQuery.data?.map(({ value }) => value) ?? []}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: actorsQuery.data?.map(({ value }) => value) ?? [],
		isLoading: actorsQuery.isLoading,
		isError: actorsQuery.isError,
		isReady: actorsQuery.isReady,
		error: actorsQuery.error,
		status: actorsQuery.status,
	}}
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
			<AtprotoActorView
				entityId={{ did: actorId.did }}
				href={resolve('/(social)/atproto/actor/[did]', {
					did: encodeURIComponent(actorId.did),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
