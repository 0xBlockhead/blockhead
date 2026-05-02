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
	import { coalesce, eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

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
		entityFieldReference: EntityFieldReference<typeof EntityType.ActivityPubNote>
	} = $props()


	// (Derived)
		const fieldQuery = useLiveQuery(
		(queryBuilder) => {
			const tr = (
				entityFieldCollections[entityFieldReference.entityType]!
			)[entityFieldReference.fieldName]!
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
								// @ts-expect-error entity field transition row — Value is the target id row
								tr[EntityMetaKey.Value]![EntityMetaKey.IdKey],
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
						const b = note[EntityMetaKey.Fields] as Record<string, unknown> | undefined
						return coalesce(
							typeof b?.['createdAt'] === 'number' ? b['createdAt'] : undefined,
							0,
						)
					}, orderByCreatedAt)
					.select(({ tr, note }) => {
						const b = note[EntityMetaKey.Fields] as Record<string, unknown> | undefined
						const content = typeof b?.['content'] === 'string' ? b['content'] : ''
						return {
							[EntityMetaKey.Id]: (
								// @ts-expect-error entity field transition row — Value is the target entity id
								tr[EntityMetaKey.Value]![EntityMetaKey.Id]
							),
							textPreview: htmlToPlainText(content),
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
		new SvelteSet(
			(fieldQuery.data ?? []).flatMap(
				(row, order) => {
					const idValue = row[EntityMetaKey.Id]
					if (
						idValue === undefined
						|| typeof idValue !== 'object'
						|| !('instanceOrigin' in idValue)
						|| !('localStatusId' in idValue)
					) {
						return []
					}
					const { instanceOrigin, localStatusId } = idValue
					if (typeof instanceOrigin !== 'string' || typeof localStatusId !== 'string') {
						return []
					}
					return [
						{
							instanceOrigin,
							localStatusId,
							order,
							textPreview: row.textPreview,
						},
					]
				},
			),
		),
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
	query={fieldQuery}
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
