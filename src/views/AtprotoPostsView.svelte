<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
	import { resolve } from '$app/paths'
	// State
	let {
		selection,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		fieldOpen = true,
		title = 'Posts',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
					<ResourceBoundary
						resource={selection({
							sources: [
								Source.Constants_Internal,
								Source.Atproto_Xrpc,
							],
							limit,
						})}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
					{#snippet children(posts)}
						<EntitiesList
							collapsible={false}
							showSummary={false}
							entityType={EntityType.AtprotoPost}
							id={`${id}-items`}
							{title}
							open={true}
							getKey={(atprotoPost) => atprotoPost.entitySelector.uri}
							placeholderText={`Loading ${title.toLowerCase()}…`}
							items={posts.entities}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No posts yet.
								</p>
							{/snippet}

							{#snippet Item({ item })}
								<a
									href={resolve('/(social)/(atproto)/atproto/post/[...uri]', {
										uri: encodeURIComponent(item.entitySelector.uri),
									})}
								>
									<TruncatedValue
										value={item.entitySelector.uri}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{:else}
				<p data-text="muted">
					Facet idle—no posts request.
				</p>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
