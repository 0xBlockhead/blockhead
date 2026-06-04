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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		href = '',
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Thread',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoPost>
			id: string
			href?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{id}
	href={href}
	bind:open
	{collapsible}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			<code>$$thread</code> lists ancestor and reply posts around this at-URI from Atproto_Xrpc / Atproto_BskySocial_Xrpc <code>getPostThread</code> responses.
		</p>
		<p>
			Ordering follows record <code>createdAt</code> when available; empty lists mean no parent or replies were returned within the fetched depth window.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
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
			)}
			{@const threadPosts = derive(
				parent,
				(parent) => {
					const atprotoPosts: Entity<typeof schema, EntityType.AtprotoPost>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						atprotoPosts
							.map((value) => ({
								value,
							}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.AtprotoPost}
				id={`${id}-items`}
				href={href}
				getKey={(atprotoPost) => atprotoPost.value[EntityMetaKey.Id].uri}
				getSortValue={(atprotoPost) => (
					`${String(atprotoPost.value.createdAt ?? 0).padStart(20, '0')}\0${atprotoPost.value[EntityMetaKey.Id].uri}`
				)}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={threadPosts}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No thread posts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<AtprotoPostView
						entityId={{ uri: item.value[EntityMetaKey.Id].uri }}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
