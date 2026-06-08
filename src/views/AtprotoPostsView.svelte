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
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		fieldOpen = true,
		title = 'Posts',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoPost>
			id: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
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
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ATProto app.bsky.feed.post records addressed by at-URI inside a given DID’s repo.
		</p>
		<p>
			Collection scope follows the repo or atprotoPosts you navigated from; URIs are stable handles for the same bytes across relays.
		</p>
		<p>
			The atprotoPosts keeps a capped newest-first slice; navigating a post resolves text, reply parent/root links, and engagement counts from the AppView API.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const atprotoNetworkOrAccount = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.AtprotoNetwork ?
						(
							fieldOpen ?
								{
									$: [Source.Constants_Internal],
									protocolName: {},
									$$atprotoActors: {
										$: [
											Source.Constants_Internal,
											Source.Atproto_Xrpc,
											Source.Atproto_BskySocial_Xrpc,
										],
										$$posts: {
											$: [
												Source.Atproto_Xrpc,
												Source.Atproto_BskySocial_Xrpc,
											],
											$limit: limit,
										},
									},
								}
							:
								{
									$: [Source.Constants_Internal],
									protocolName: {},
								}
						)
					:
						(
							fieldOpen ?
								{
									$$posts: {
										$: [
											Source.Atproto_Xrpc,
											Source.Atproto_BskySocial_Xrpc,
										],
										$limit: limit,
									},
								}
							:
								{}
						)
				),
			)}
			{@const posts = derive(
				atprotoNetworkOrAccount,
				(atprotoNetworkOrAccount) => {
					const atprotoPosts: Entity<typeof schema, EntityType.AtprotoPost>[] = (
						entityFieldReference.entityType === EntityType.AtprotoNetwork ?
							(atprotoNetworkOrAccount.$$atprotoActors ?? [])
								.flatMap((actor: Entity<typeof schema, EntityType.AtprotoActor>) => actor.$$posts ?? [])
						:
							(atprotoNetworkOrAccount.$$posts ?? [])
					)
					return atprotoPosts
				},
			)}
			{#key `${stringify(entityFieldReference.entityId)}-${limit}-${fieldOpen}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.AtprotoPost}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(atprotoPost) => atprotoPost[EntityMetaKey.Id].uri}
					getSortValue={(atprotoPost) => (
						`${String(-(atprotoPost.createdAt ?? 0)).padStart(20, '0')}\0${atprotoPost[EntityMetaKey.Id].uri}`
					)}
					placeholderText={`Loading ${title.toLowerCase()}…`}
					resource={posts}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No posts yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<AtprotoPostView
							entityId={{ uri: item[EntityMetaKey.Id].uri }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
