<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeChannel_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YoutubeChannel_TimestampView from '$/views/YoutubeChannel_TimestampView.svelte'
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
		{@const selection = select(EntityType.YoutubeChannel_Timestamp, youtubeChannelTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeChannelTimestampHrefFields = { ...youtubeChannelTimestamp, ...youtubeChannelTimestamp[EntityMetaKey.Selector] }}
		<YoutubeChannel_TimestampView
			selection={selection}
			prefetched={youtubeChannelTimestampFields}
			href={
				(youtubeChannelTimestampHrefFields.timestampMs !== undefined && youtubeChannelTimestampHrefFields.source !== undefined && youtubeChannelTimestampHrefFields.$channel !== undefined && youtubeChannelTimestampHrefFields.$channel.channelId !== undefined ? resolve('/youtube/channel/[channelId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeChannelTimestampHrefFields.timestampMs ?? ''),
					source: String(youtubeChannelTimestampHrefFields.source ?? ''),
					channelId: encodeURIComponent(String(youtubeChannelTimestampHrefFields.$channel.channelId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
