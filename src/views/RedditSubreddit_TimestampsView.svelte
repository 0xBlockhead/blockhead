<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { stringify } from 'devalue'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		selection,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditSubreddit_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditSubreddit_TimestampView from '$/views/RedditSubreddit_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditSubreddit_Timestamp}
	{href}
	{id}
	bind:open
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Timestamped social metric snapshots captured from provider-visible counters.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Constants_Internal],
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(redditSubredditTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RedditSubreddit_Timestamp}
						id={`${id}-items`}
						href={href}
						{title}
						items={redditSubredditTimestamps.entities}
						open={true}
					>
						{#snippet Item({ item })}
							<RedditSubreddit_TimestampView
								selection={select(EntityType.RedditSubreddit_Timestamp, item.entitySelector)}
								{href}
								layout={EntityLayout.Summary}

								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
