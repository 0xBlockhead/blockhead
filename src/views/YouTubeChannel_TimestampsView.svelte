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
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.YouTubeChannel_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()

	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeChannel_TimestampView from '$/views/YouTubeChannel_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubeChannel_Timestamp}
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
				{#snippet children(youTubeChannelTimestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.YouTubeChannel_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={youTubeChannelTimestamps.entities}
					>
						{#snippet Item({ item })}
							<YouTubeChannel_TimestampView
								selection={select(EntityType.YouTubeChannel_Timestamp, item.entitySelector)}
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
