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
		title = 'YouTube channel observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube channel observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeChannel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeChannel_Timestamp>
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
	import YoutubeChannel_TimestampView from '$/views/YoutubeChannel_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$channel: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeChannel_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubeChannelTimestamps)}
			{@const uniqueYoutubeChannelTimestamps = [...new Map(youtubeChannelTimestamps.values.map((youtubeChannelTimestamp) => [youtubeChannelTimestamp[EntityMetaKey.SelectorKey], youtubeChannelTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeChannel_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeChannelTimestamps.values.length === uniqueYoutubeChannelTimestamps.length && youtubeChannelTimestamps.totalCount != null && youtubeChannelTimestamps.totalCount >= uniqueYoutubeChannelTimestamps.length ? youtubeChannelTimestamps.totalCount : uniqueYoutubeChannelTimestamps.length}
				getKey={(youtubeChannelTimestamp) => youtubeChannelTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeChannelTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube channel observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeChannelTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeChannel_Timestamp> })}
					<YoutubeChannel_TimestampView
						href={
							resolve('/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]', {
								channelId: String(youtubeChannelTimestamp.entitySelector.$channel.channelId),
								timestampMs: String(youtubeChannelTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.YoutubeChannel_Timestamp, youtubeChannelTimestamp.entitySelector)}
						prefetched={youtubeChannelTimestamp}
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
		entityType={EntityType.YoutubeChannel_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
