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


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

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

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Mastodon_Rest,
				],
			},
		},
	)

	const notes = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.ActivityPubNote>[]
			)
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
	{placeholderText}
	resource={notes}
	{title}
>
	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
			{@const nid = props.item.value[EntityMetaKey.Id]}
			{@const textPreview = htmlToPlainText(
				props.item.value.content,
			)}
			<div
				data-column
				data-row-item="flexible"
			>
				<p>
					<a
						href={resolve(
							'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
							{
								instanceOrigin: encodeURIComponent(nid.instanceOrigin),
								localStatusId: encodeURIComponent(nid.localStatusId),
							},
						)}
					>
						{nid.localStatusId}
					</a>
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
