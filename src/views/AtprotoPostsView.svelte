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
		collapsible = true,
		fieldOpen = true,
		title = 'Posts',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoPost>
			href: string
			id: string
			limit?: number
			open?: boolean
			fieldOpen?: boolean
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
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{href}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ATProto repository records—posts and reposts—addressed by at-URI inside a given DID’s repo.
		</p>
		<p>
			Collection scope follows the repo or list you navigated from; URIs are stable handles for the same bytes across relays.
		</p>
		<p>
			The list keeps a capped newest-first slice; navigating a post resolves the full at-URI record, including embeds, facets, and reply parent linkage when the API returns them.
		</p>
	{/snippet}

	{#snippet body()}
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
									$$atprotoPosts: {
										$: [
											Source.Constants_Internal,
											Source.Atproto_Xrpc,
										],
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
									$: [Source.Atproto_Xrpc],
									$$posts: {},
								}
							:
								{
									$: [Source.Atproto_Xrpc],
								}
						)
				),
			)}
			{@const posts = derive(
				atprotoNetworkOrAccount,
				(atprotoNetworkOrAccount) => {
					const rows: Entity<typeof schema, EntityType.AtprotoPost>[] = (
						entityFieldReference.entityType === EntityType.AtprotoNetwork ?
							(atprotoNetworkOrAccount.$$atprotoPosts ?? [])
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
					{href}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Id].uri}
					getSortValue={(row) => (
						`${String(-(row.createdAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Id].uri}`
					)}
					placeholderKeys={new SvelteSet()}
					placeholderText={`Loading ${title.toLowerCase()}…`}
					resource={posts}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No posts yet.
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
		{/if}
	{/snippet}
</EntitiesList>
