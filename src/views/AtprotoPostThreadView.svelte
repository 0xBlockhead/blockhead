<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Thread',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoPost>
			href: string
			id: string
			limit?: number
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

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			...(open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
					},
				}
			:
				{}),
		},
	)

	const threadPosts = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.AtprotoPost>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.toSorted((leftPost, rightPost) => (
						(leftPost.createdAt ?? 0) - (rightPost.createdAt ?? 0)
						|| leftPost[EntityMetaKey.Id].uri.localeCompare(rightPost[EntityMetaKey.Id].uri)
					))
					.slice(0, limit)
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{href}
	{id}
	bind:open
	{collapsible}
	getKey={(row) => row.value[EntityMetaKey.Id].uri}
	getSortValue={(row) => (
		`${String(row.value.createdAt ?? 0).padStart(20, '0')}\0${row.value[EntityMetaKey.Id].uri}`
	)}
	placeholderKeys={new SvelteSet()}
	placeholderText={`Loading ${title.toLowerCase()}…`}
	resource={threadPosts}
	{title}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			<code>$$thread</code> lists ancestor and reply posts around this at-URI from Atproto_Xrpc / Atproto_BskySocial_Xrpc <code>getPostThread</code> responses.
		</p>
		<p>
			Ordering follows record <code>createdAt</code> when available; empty lists mean no parent or replies were returned within the fetched depth window.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No thread posts yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			<AtprotoPostView
				entityId={{ uri: props.item.value[EntityMetaKey.Id].uri }}
				href={resolve('/(social)/(atproto)/atproto/post/[uri]', {
					uri: encodeURIComponent(props.item.value[EntityMetaKey.Id].uri),
				})}
				layout={EntityLayout.SummaryDetails}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
