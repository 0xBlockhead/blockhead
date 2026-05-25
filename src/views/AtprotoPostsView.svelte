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
	import { SvelteSet } from 'svelte/reactivity'


	// Props
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
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
			ATProto repository records—posts and reposts—addressed by at-URI inside a given DID’s repo.
		</p>
		<p>
			Collection scope follows the repo or list you navigated from; URIs are stable handles for the same bytes across relays.
		</p>
		<p>
			The list keeps a capped newest-first slice; navigating a post resolves text, reply parent/root links, and engagement counts from the AppView API.
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
					const rows: Entity<typeof schema, EntityType.AtprotoPost>[] = (
						entityFieldReference.entityType === EntityType.AtprotoNetwork ?
							(atprotoNetworkOrAccount.$$atprotoActors ?? [])
								.flatMap((actor) => actor.$$posts ?? [])
						:
							(atprotoNetworkOrAccount.$$posts ?? [])
					)
					return rows.slice(0, limit)
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
					getKey={(row) => row[EntityMetaKey.Id].uri}
					getSortValue={(row) => (
						`${String(-(row.createdAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Id].uri}`
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
