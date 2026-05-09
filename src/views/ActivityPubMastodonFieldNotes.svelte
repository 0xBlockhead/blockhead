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
	import { coalesce, eq, useLiveQuery } from '@tanstack/svelte-db'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { entityFieldCollectionForReference } from '$/collections/$collections.ts'

	import { htmlToPlainText } from '$/lib/html.ts'


	// Props
	let {
		href,
		id,
		orderByCreatedAt,
		placeholderText,
		title,
		entityFieldReference,
	}: {
		href: string
		id: string
		orderByCreatedAt: 'asc' | 'desc'
		placeholderText: string
		title: string
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.ActivityPubNote>
	} = $props()


	// (Derived)
	const fieldQuery = useLiveQuery(
		(queryBuilder) => {
			const tr = (
				entityFieldCollectionForReference(
					entityFieldCollections,
					entityFieldReference,
				)
			)
			return (
				queryBuilder
					.from({ tr })
					.where(({ tr }) => (
						eq(
							tr[EntityMetaKey.ParentIdKey],
							stringify(entityFieldReference.entityId),
						)
					))
					.where(({ tr }) => (
						eq(
							tr[EntityMetaKey.Source],
							Source.Mastodon_Rest,
						)
					))
					.innerJoin(
						{ note: entityCollectionByEntityType[EntityType.ActivityPubNote]! },
						({ tr, note }) => (
							eq(
								tr[EntityMetaKey.Value][EntityMetaKey.IdKey],
								note[EntityMetaKey.IdKey],
							)
						),
					)
					.where(({ note }) => (
						eq(
							note[EntityMetaKey.Source],
							Source.Mastodon_Rest,
						)
					))
					.orderBy(({ note }) => {
						return coalesce(
							note[EntityMetaKey.Fields].createdAt,
							0,
						)
					}, orderByCreatedAt)
					.select(({ tr, note }) => {
						return {
							note: tr[EntityMetaKey.Value],
							content: note[EntityMetaKey.Fields].content,
						}
					})
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
			() => orderByCreatedAt,
		],
	)

	const noteItems = $derived(
		(fieldQuery.data ?? [])
			.map(({ content, note }, order) => ({
				...note[EntityMetaKey.Id],
				order,
				textPreview: htmlToPlainText(content ?? ''),
			})),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	collapsible={true}
	entityType={EntityType.ActivityPubNote}
	getKey={(row) => `${row.instanceOrigin}\x1e${row.localStatusId}`}
	getSortValue={(row) => row.order}
	{href}
	{id}
	items={noteItems}
	open={true}
	{placeholderText}
	query={{
		data: noteItems,
		isLoading: fieldQuery.isLoading,
		isError: fieldQuery.isError,
		isReady: fieldQuery.isReady,
		status: fieldQuery.status,
	}}
	{title}
>
	{#snippet Item({ item, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if item}
			<div
				data-column
				data-row-item="flexible"
			>
				<p>
					<a
						href={resolve(
							'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
							{
								instanceOrigin: encodeURIComponent(item.instanceOrigin),
								localStatusId: encodeURIComponent(item.localStatusId),
							},
						)}
					>
						{item.localStatusId}
					</a>
				</p>
				{#if item.textPreview}
					<p data-text="muted">
						<TruncatedValue
							endLength={12}
							format={TruncatedValueFormat.Visual}
							startLength={88}
							value={item.textPreview}
						/>
					</p>
				{/if}
			</div>
		{/if}
	{/snippet}
</EntitiesList>
