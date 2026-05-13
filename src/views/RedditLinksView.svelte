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


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Reddit_Rest,
			],
			[fieldName]: {
				$: [
					Source.Reddit_Rest,
				],
				limit,
			},
		},
	)

	const links = derive(
		parentEntity,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.RedditLink>
				)[]
			)
				.toSorted((a, b) => (
					b[EntityMetaKey.Id].fullname.localeCompare(a[EntityMetaKey.Id].fullname)
				))
				.map((link) => (
					{
						...link[EntityMetaKey.Id],
						sortKey: link[EntityMetaKey.IdKey],
					}
				))
		),
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
	{title}
	bind:open
	resource={links}
	placeholderText="Loading posts…"
	getKey={(row) => row.fullname}
	getSortValue={(row) => row.sortKey}
	placeholderKeys={new SvelteSet<string>()}
>
	{#snippet Empty()}
		<p data-text="muted">
			No Reddit posts to show yet.
		</p>
	{/snippet}

	{#snippet Item({
		item: row,
		isPlaceholder,
	})}
		{#if isPlaceholder === false}
			<RedditLinkView
				entityId={{ fullname: row.fullname }}
				href={resolve('/(social)/reddit/link/[fullname]', {
					fullname: encodeURIComponent(row.fullname),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
