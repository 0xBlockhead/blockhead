<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id,
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Subreddits',
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditSubreddit>
		id: string
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
					],
				})} placeholderText="Loading subreddits…">
				{#snippet children(subreddits)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RedditSubreddit}
						id={`${id}-items`}
						{title}
						open={true}
						items={subreddits.entities}
						getKey={(subreddit) => stringify(subreddit.entitySelector)}
						getSortValue={(subreddit) => subreddit.entitySelector.name}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No subreddits in this Reddit hub yet.
								</p>
							{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(reddit)/reddit/r/[name]', {
									name: item.entitySelector.name,
								})}
							>
								<TruncatedValue
									value={`r/${item.entitySelector.name}`}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
