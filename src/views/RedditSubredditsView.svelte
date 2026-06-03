<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Subreddits',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditSubreddit>
			id: string
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.RedditSubreddit}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Named communities on Reddit (<code>/r/…</code>).
		</p>
		<p>
			Not chat inboxes, storage roots, or profile graphs from other networks.
		</p>
		<p>
			Each redditSubreddits row is a Reddit community namespace—compare to profiles on X or blobs on content-addressed storage.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No subreddits in this Reddit hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Constants_Internal,
						Source.Reddit_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						],
					},
				},
			)}
			{@const subreddits = derive(
				parent,
				(parent) => {
					const redditSubreddits: Entity<typeof schema, EntityType.RedditSubreddit>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						redditSubreddits.map((value) => ({
							entityId: value[EntityMetaKey.Id],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RedditSubreddit}
				id={`${id}-items`}
				{title}
				open={true}
				resource={subreddits}
				placeholderText="Loading subreddits…"
				getKey={(subreddit) => stringify(subreddit.entityId)}
				getSortValue={(subreddit) => subreddit.entityId.name}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No subreddits in this Reddit hub yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: subreddit,
				})}
					<RedditSubredditView
						entityId={subreddit.entityId}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
