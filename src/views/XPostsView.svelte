<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		open = $bindable(true),
		title = 'X posts',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XPost>
			href: string
			id: string
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Constants_Internal],
			[entityFieldReference.fieldName]: {
				$: [Source.X_Rest],
			},
		},
	)

	const envelopes = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.XPost>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((a, b) => (
						a[EntityMetaKey.Id].id.localeCompare(b[EntityMetaKey.Id].id)
					))
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.XPost}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.value[EntityMetaKey.Id].id}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={envelopes}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Public posts on X (Twitter).
		</p>
		<p>
			Not Reddit threads, blob storage, pools, candle data, chats, or logs. Live lookup depends on OAuth or bearer credentials and X developer API availability.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No X posts in this list yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<XPostView
				entityId={{ id: props.item.value[EntityMetaKey.Id].id }}
				href={resolve('/(social)/x/post/[postId]', {
					postId: encodeURIComponent(props.item.value[EntityMetaKey.Id].id),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
