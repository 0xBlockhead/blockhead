<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'YouTube video observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideo_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeVideo_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YoutubeVideo_TimestampView from '$/views/YoutubeVideo_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$video: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(youtubeVideoTimestamps)}
			{@const uniqueYoutubeVideoTimestamps = [...new Map(youtubeVideoTimestamps.values.map((youtubeVideoTimestamp) => [youtubeVideoTimestamp[EntityMetaKey.SelectorKey], youtubeVideoTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeVideo_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeVideoTimestamps.totalCount}
				getKey={(youtubeVideoTimestamp) => youtubeVideoTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeVideoTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube video observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeVideoTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeVideo_Timestamp> })}
					{@const youtubeVideoTimestampFields = { ...youtubeVideoTimestamp[EntityMetaKey.Selector], ...youtubeVideoTimestamp }}
					{@const youtubeVideoTimestampHrefFields = { ...youtubeVideoTimestamp, ...youtubeVideoTimestamp[EntityMetaKey.Selector] }}
					<YoutubeVideo_TimestampView
						selection={select(EntityType.YoutubeVideo_Timestamp, youtubeVideoTimestamp[EntityMetaKey.Selector])}
						prefetched={youtubeVideoTimestampFields}
						href={
							(youtubeVideoTimestampHrefFields.$video !== undefined && youtubeVideoTimestampHrefFields.$video.videoId !== undefined && youtubeVideoTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]', {
								videoId: String(youtubeVideoTimestampHrefFields.$video.videoId ?? ''),
								timestampMs: String(youtubeVideoTimestampHrefFields.timestampMs ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubeVideo_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
