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
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(true),
		title = 'Posts',
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

	const atprotoNetworkOrAccount = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		entityFieldReference.entityType === EntityType.AtprotoNetwork ?
			{
				$: [Source.Constants_Internal],
				protocolName: {},
				$$atprotoPosts: {
					$: [
						Source.Constants_Internal,
						Source.Atproto_Xrpc,
					],
				},
			}
		:
			{
				$: [Source.Atproto_Xrpc],
				$$posts: {},
			},
	)

	const posts = derive(
		atprotoNetworkOrAccount,
		(loaded) => {
			const rows = (
				(
					entityFieldReference.entityType === EntityType.AtprotoNetwork ?
						loaded.$$atprotoPosts
					:
						loaded.$$posts
				)
				?? []
			) as Entity<typeof schema, EntityType.AtprotoPost>[]
			return (
				rows
					.toSorted((a, b) => (
						(b.createdAt ?? 0) - (a.createdAt ?? 0)
					))
					.slice(0, limit)
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{href}
	{id}
	bind:open
	{title}
	{...entitiesListRest}
>
	{#snippet body()}
		{#key `${stringify(entityFieldReference.entityId)}-${limit}`}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.AtprotoPost}
				id={`${id}-items`}
				{href}
				{title}
				open={true}
				getKey={(row) => row[EntityMetaKey.Id].uri}
				getSortValue={(row) => (
					-(row.createdAt ?? 0)
				)}
				placeholderKeys={new SvelteSet()}
				resource={posts}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No AT Protocol posts to show yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<AtprotoPostView
							entityId={{ uri: props.item[EntityMetaKey.Id].uri }}
							href={resolve('/(social)/atproto/post/[uri]', {
								uri: encodeURIComponent(props.item[EntityMetaKey.Id].uri),
							})}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/key}
	{/snippet}
</EntitiesList>

