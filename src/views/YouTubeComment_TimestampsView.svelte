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
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.YouTubeComment_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeComment_TimestampView from '$/views/YouTubeComment_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubeComment_Timestamp}
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
						sources: [Source.Youtube_Rest, Source.Piped_Rest],
						limit: 64,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(youTubeCommentTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.YouTubeComment_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={youTubeCommentTimestamps.entities}
					>
						{#snippet Item({ item })}
							<YouTubeComment_TimestampView
								selection={select(EntityType.YouTubeComment_Timestamp, item.entitySelector)}
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
