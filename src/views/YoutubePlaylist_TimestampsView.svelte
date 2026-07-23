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
		title = 'YouTube playlist observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubePlaylist_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubePlaylist_Timestamp>
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
	entityType={EntityType.YoutubePlaylist_Timestamp}
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
				$playlist: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubePlaylistTimestamps) => [...new Map(youtubePlaylistTimestamps.values.map((youtubePlaylistTimestamp) => [youtubePlaylistTimestamp[EntityMetaKey.SelectorKey], youtubePlaylistTimestamp])).values()]}
	getKey={(youtubePlaylistTimestamp) => youtubePlaylistTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube playlist observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubePlaylistTimestamp })}
		{@const youtubePlaylistTimestampFields = { ...youtubePlaylistTimestamp[EntityMetaKey.Selector], ...youtubePlaylistTimestamp }}
		<EntityView
			entityType={EntityType.YoutubePlaylist_Timestamp}
			entitySelector={youtubePlaylistTimestamp[EntityMetaKey.Selector]}
			href={
				(
					youtubePlaylistTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in youtubePlaylistTimestamp[EntityMetaKey.Selector]
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector] != null && 'source' in youtubePlaylistTimestamp[EntityMetaKey.Selector]
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector].source != null
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector] != null && '$playlist' in youtubePlaylistTimestamp[EntityMetaKey.Selector]
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector].$playlist != null && 'playlistId' in youtubePlaylistTimestamp[EntityMetaKey.Selector].$playlist
					&& youtubePlaylistTimestamp[EntityMetaKey.Selector].$playlist.playlistId != null ?
						resolve('/youtube/playlist/[playlistId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubePlaylistTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(youtubePlaylistTimestamp[EntityMetaKey.Selector].source ?? ''),
					playlistId: encodeURIComponent(String(youtubePlaylistTimestamp[EntityMetaKey.Selector].$playlist.playlistId ?? '')),
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
				{[[String((youtubePlaylistTimestampFields.$playlist.title) ?? '')].filter(Boolean).join(' ') || [String((youtubePlaylistTimestampFields.$playlist.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist', String((youtubePlaylistTimestampFields.timestampMs) ?? ''), String((youtubePlaylistTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
