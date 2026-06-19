<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
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
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditComment_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.RedditComment_Timestamp}
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
				{#snippet children(redditCommentTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RedditComment_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={redditCommentTimestamps.entities}
					>
						{#snippet Item({ item })}
							<RedditComment_TimestampView
								selection={select(EntityType.RedditComment_Timestamp, item.entitySelector)}
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
