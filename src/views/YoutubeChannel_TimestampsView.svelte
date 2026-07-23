<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'YouTube channel observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeChannel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeChannel_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeChannel_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$channel: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubeChannelTimestamps) => [...new Map(youtubeChannelTimestamps.values.map((youtubeChannelTimestamp) => [youtubeChannelTimestamp[EntityMetaKey.SelectorKey], youtubeChannelTimestamp])).values()]}
	getKey={(youtubeChannelTimestamp) => youtubeChannelTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube channel observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeChannelTimestamp })}
		{@const youtubeChannelTimestampFields = { ...youtubeChannelTimestamp[EntityMetaKey.Selector], ...youtubeChannelTimestamp }}
		<EntityView
			entityType={EntityType.YoutubeChannel_Timestamp}
			entitySelector={youtubeChannelTimestamp[EntityMetaKey.Selector]}
			href={
				(
					youtubeChannelTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in youtubeChannelTimestamp[EntityMetaKey.Selector]
					&& youtubeChannelTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& youtubeChannelTimestamp[EntityMetaKey.Selector] != null && 'source' in youtubeChannelTimestamp[EntityMetaKey.Selector]
					&& youtubeChannelTimestamp[EntityMetaKey.Selector].source != null
					&& youtubeChannelTimestamp[EntityMetaKey.Selector] != null && '$channel' in youtubeChannelTimestamp[EntityMetaKey.Selector]
					&& youtubeChannelTimestamp[EntityMetaKey.Selector].$channel != null && 'channelId' in youtubeChannelTimestamp[EntityMetaKey.Selector].$channel
					&& youtubeChannelTimestamp[EntityMetaKey.Selector].$channel.channelId != null ?
						resolve('/youtube/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeChannelTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(youtubeChannelTimestamp[EntityMetaKey.Selector].source ?? ''),
					channelId: encodeURIComponent(String(youtubeChannelTimestamp[EntityMetaKey.Selector].$channel.channelId ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((youtubeChannelTimestampFields.$channel.title) ?? '')].filter(Boolean).join(' ') || [String((youtubeChannelTimestampFields.$channel.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel', String((youtubeChannelTimestampFields.timestampMs) ?? ''), String((youtubeChannelTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'YouTube channel observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
