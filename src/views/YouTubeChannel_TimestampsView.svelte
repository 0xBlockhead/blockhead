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
		placeholderText,
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
			selection({
				fields: {
					$channel: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={youtubeChannelTimestamps.totalCount}
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
					{@const youtubeChannelTimestampFields = { ...youtubeChannelTimestamp[EntityMetaKey.Selector], ...youtubeChannelTimestamp }}
					{@const youtubeChannelTimestampHrefFields = { ...youtubeChannelTimestamp, ...youtubeChannelTimestamp[EntityMetaKey.Selector] }}
					<YoutubeChannel_TimestampView
						selection={select(EntityType.YoutubeChannel_Timestamp, youtubeChannelTimestamp[EntityMetaKey.Selector])}
						prefetched={youtubeChannelTimestampFields}
						href={
							(youtubeChannelTimestampHrefFields.$channel !== undefined && youtubeChannelTimestampHrefFields.$channel.channelId !== undefined && youtubeChannelTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]', {
								channelId: String(youtubeChannelTimestampHrefFields.$channel.channelId ?? ''),
								timestampMs: String(youtubeChannelTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.YoutubeChannel_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
