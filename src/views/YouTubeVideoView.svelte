<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(youtube)/youtube/video/[videoId]', {
			videoId: selection.entitySelector.videoId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeVideo>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const video = $derived(
				selection(({ sources: [
						Source.Constants_Internal,
					], fields: {
					title: true,
					publishedAt: true,
					publishedAtMs: true,
					thumbnailUrl: true,
					$author: true,
				} }),
			)
		)

	const idKey = $derived(stringify(selection.entitySelector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeVideo}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={video}>
			{#snippet children(video)}
				{#if video.fields.thumbnailUrl}
					<IconComponent
						src={video.fields.thumbnailUrl}
						alt={video.fields.title ?? selection.entitySelector.videoId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{selection.entitySelector.videoId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={video}
			placeholderText="Loading video…"
		>
			{#snippet children(video)}
				{video.fields.title ?? selection.entitySelector.videoId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Video ids are fixed 11-character watch keys; metadata comes from the Data API or Piped stream payloads.
		</p>
		<p>
			publishedAt is ISO-8601 from Google; Piped may surface a different time string for the same upload.
		</p>
		{/snippet}

		{#snippet Content({})}
			<dl data-column-item="center">
				{#if open}
					<div>
						<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.publishedAtMs != null}
									<Timestamp timestamp={video.fields.publishedAtMs} />
								{:else if video.fields.publishedAt != null}
									{video.fields.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Channel</dt>
					<dd>
						<ResourceBoundary
							resource={video}
							placeholderText="Loading video…"
						>
							{#snippet children(video)}
								{#if video.fields.$author}
									<YouTubeChannelView
										selection={select(EntityType.YouTubeChannel, video.fields.$author[EntityMetaKey.Selector])}
										layout={EntityLayout.Title}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

		</dl>
	{/snippet}
	</EntityView>
