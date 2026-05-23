<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		href,
		id,
		orderByCreatedAt,
		placeholderText,
		title,
		entityFieldReference,
		fieldOpen = true,
	}: {
		href: string
		id: string
		orderByCreatedAt: 'asc' | 'desc'
		placeholderText: string
		title: string
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.ActivityPubNote>
		fieldOpen?: boolean
	} = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			fieldOpen ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Mastodon_Rest,
						],
					},
				}
			:
				{}
		),
	)

	const notes = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.ActivityPubNote>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows.map((value) => ({
					value,
					sortKey: value.createdAt ?? 0,
				}))
					.toSorted((a, b) => (
						orderByCreatedAt === 'asc' ?
							a.sortKey - b.sortKey
						:
							b.sortKey - a.sortKey
					))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	collapsible={true}
	entityType={EntityType.ActivityPubNote}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.sortKey}
	{href}
	{id}
	open={true}
	placeholderKeys={new SvelteSet()}
	resource={notes}
	{title}
	placeholderText={(
		fieldOpen ?
			placeholderText
		:
			'Facet idle—no timeline request.'
	)}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Status objects in ActivityPub/Mastodon timelines: each row is a public note (HTML body, visibility, replies) addressed by instance origin + status id.
		</p>
		<p>
			Ordering follows <code>createdAt</code> for the facet (newest or oldest first); empty responses usually mean the collection is private or not yet synced from the origin.
		</p>
		<p>
			If the parent entity keeps this field reference idle, clients skip the Mastodon collection request for that scope until the facet is activated—same as an untouched relation in a typical ActivityPub client.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const nid = props.item.value[EntityMetaKey.Id]}
			{@const mastodonOriginLabel = nid.instanceOrigin}
			{@const textPreview = htmlToPlainText(
				props.item.value.content,
			)}
			<div
				data-column
				data-row-item="flexible"
			>
				<p>
					<a
						title="Open this Mastodon status"
						href={resolve(
							'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
							{
								instanceOrigin: encodeURIComponent(nid.instanceOrigin),
								localStatusId: encodeURIComponent(nid.localStatusId),
							},
						)}
					>
						<TruncatedValue
							endLength={10}
							format={TruncatedValueFormat.Visual}
							startLength={24}
							value={nid.localStatusId}
						/>
					</a>
				</p>
				<p data-text="muted">
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={24}
						value={mastodonOriginLabel}
					/>
				</p>
				{#if textPreview !== ''}
					<p data-text="muted">
						<TruncatedValue
							endLength={12}
							format={TruncatedValueFormat.Visual}
							startLength={88}
							value={textPreview}
						/>
					</p>
				{/if}
			</div>
		{/if}
	{/snippet}
</EntitiesList>
