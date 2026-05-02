<script lang="ts">
	// Types/constants
	import { type EntityFieldReference, type EntityId, schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { coalesce, eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Posts',
	}: {
		entityFieldReference: EntityFieldReference<typeof EntityType.RedditLink>
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
						entityFieldCollections[entityFieldReference.entityType]!
					)[entityFieldReference.fieldName]!,
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
							// @ts-expect-error entity field row stores target id key
							linkFieldRow[EntityMetaKey.Value]![EntityMetaKey.IdKey],
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
				.orderBy(({ link }) => coalesce(link.timestamp, 0), 'desc')
				.orderBy(({ link }) => link[EntityMetaKey.IdKey], 'desc')
				.limit(limit)
				.select(({ linkFieldRow }) => ({
					[EntityMetaKey.Id]: (
						// @ts-expect-error entity field row stores target id
						linkFieldRow[EntityMetaKey.Value]![EntityMetaKey.Id]
					),
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => limit,
		],
	)

	const linkItems = $derived.by(() => (
		new SvelteSet(
			(linksQuery.data ?? []).flatMap((row, order) => {
				const linkId = row[EntityMetaKey.Id]
				return (
					linkId !== undefined
					&& typeof linkId === 'object'
					&& 'fullname' in linkId
					&& typeof linkId.fullname === 'string'
				) ?
					[
						{
							...(linkId as EntityId<typeof schema, EntityType.RedditLink>),
							order,
						},
					]
				:	[]
			}),
		)
	))


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
	query={linksQuery}
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
