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

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditLink>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	const linksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					linkFieldRow: (
						entityFieldCollectionForReference(
							entityFieldCollections,
							entityFieldReference,
						)
					),
				})
				.where(({ linkFieldRow }) => (
					eq(
						linkFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.where(({ linkFieldRow }) => (
					eq(
						linkFieldRow[EntityMetaKey.Source],
						Source.Reddit_Rest,
					)
				))
				.innerJoin(
					{ link: entityCollectionByEntityType[EntityType.RedditLink] },
					({ linkFieldRow, link }) => (
						eq(
							linkFieldRow[EntityMetaKey.Value][EntityMetaKey.IdKey],
							link[EntityMetaKey.IdKey],
						)
					),
				)
				.where(({ link }) => (
					eq(
						link[EntityMetaKey.Source],
						Source.Reddit_Rest,
					)
				))
				.orderBy(({ link }) => link[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ linkFieldRow }) => (
					{ value: linkFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
		],
	)

	const linkItems = $derived(
		(linksQuery.data ?? []).map(({ value: link }, order) => ({
			...link[EntityMetaKey.Id],
			order,
		})),
	)

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditLink}
	{href}
	{id}
	getKey={(row) => row.fullname}
	getSortValue={(row) => row.order}
	items={linkItems}
	bind:open
	placeholderKeys={new SvelteSet<string>()}
	query={{
		data: linkItems,
		isLoading: linksQuery.isLoading,
		isError: linksQuery.isError,
		isReady: linksQuery.isReady,
		error: linksQuery.error,
		status: linksQuery.status,
	}}
	{title}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Reddit posts to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<RedditLinkView
				entityId={{ fullname: item.fullname }}
				href={resolve('/(social)/reddit/link/[fullname]', {
					fullname: encodeURIComponent(item.fullname),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
