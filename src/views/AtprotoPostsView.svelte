<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	type AtprotoPostOrderFieldRow = {
		createdAt?: number
		[EntityMetaKey.SelectorKey]: string
	}


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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


	const atprotoPostOrderBy = [
		[
			({ fieldRow }) => fieldRow.createdAt,
			{
				direction: 'desc',
			},
		],
		[
			({ fieldRow }) => fieldRow[EntityMetaKey.SelectorKey],
			'asc',
		],
	] as const


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{#if fieldOpen}
				{@const atprotoNetworkOrAccount = subscribe(entityFieldReference.entityType,
					entityFieldReference.selector,
					(
						entityFieldReference.entityType === EntityType.AtprotoNetwork ?
							{
								sources: [Source.Constants_Internal],
								fields: {
									protocolName: true,
									$$atprotoPosts: {
										sources: [
											Source.Constants_Internal,
											Source.Atproto_Xrpc,
											Source.Atproto_BskySocial_Xrpc,
										],
										orderBy: [...atprotoPostOrderBy],
										limit: limit,
									},
								},
							}
						:
							{
								fields: {
									$$posts: {
										sources: [
											Source.Atproto_Xrpc,
											Source.Atproto_BskySocial_Xrpc,
										],
										orderBy: [...atprotoPostOrderBy],
										limit: limit,
									},
								},
							}
					),
				)}
				{#key `${stringify(entityFieldReference.selector)}-${limit}`}
					<ResourceBoundary
						resource={atprotoNetworkOrAccount}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
						{#snippet children(atprotoNetworkOrAccount)}
							<EntitiesList
								collapsible={false}
								showSummary={false}
								entityType={EntityType.AtprotoPost}
								id={`${id}-items`}
								{title}
								open={true}
								getKey={(atprotoPost) => atprotoPost[EntityMetaKey.Selector].uri}
								placeholderText={`Loading ${title.toLowerCase()}…`}
								items={
									entityFieldReference.entityType === EntityType.AtprotoNetwork ?
										atprotoNetworkOrAccount.fields.$$atprotoPosts?.values ?? []
									:
										atprotoNetworkOrAccount.fields.$$posts?.values ?? []
								}
							>
								{#snippet Empty()}
									<p data-text="muted">
										No posts yet.
									</p>
								{/snippet}

								{#snippet Item({ item })}
									<AtprotoPostView
										selector={{ uri: item[EntityMetaKey.Selector].uri }}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</EntitiesList>
						{/snippet}
					</ResourceBoundary>
				{/key}
			{:else}
				<p data-text="muted">
					Facet idle—no posts request.
				</p>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
