<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.YoutubePlaylist_Timestamp> = $props()


	// Components
	import Timestamp from '$/components/Timestamp.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubePlaylist_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? ([String(selection.entitySelector.timestampMs), selection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube playlist observation')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
				{
					playlistId: encodeURIComponent(selection.entitySelector.$playlist.playlistId),
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<YoutubePlaylistView
			selection={select(EntityType.YoutubePlaylist, selection.entitySelector.$playlist)}
			href={null}
			layout={EntityLayout.Title}
		/>

		<Timestamp timestamp={selection.entitySelector.timestampMs} />
		{selection.entitySelector.source}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
