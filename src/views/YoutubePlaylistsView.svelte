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
		title = 'YouTube playlists',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubePlaylists-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubePlaylist>
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
	entityType={EntityType.YoutubePlaylist}
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
				title: true,
				playlistId: true,
				$channel: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubePlaylists) => [...new Map(youtubePlaylists.values.map((youtubePlaylist) => [youtubePlaylist[EntityMetaKey.SelectorKey], youtubePlaylist])).values()]}
	getKey={(youtubePlaylist) => youtubePlaylist[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube playlists yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubePlaylist })}
		{@const youtubePlaylistFields = { ...youtubePlaylist[EntityMetaKey.Selector], ...youtubePlaylist }}
		<EntityView
			entityType={EntityType.YoutubePlaylist}
			entitySelector={youtubePlaylist[EntityMetaKey.Selector]}
			href={
				(
					youtubePlaylist[EntityMetaKey.Selector] != null && 'playlistId' in youtubePlaylist[EntityMetaKey.Selector]
					&& youtubePlaylist[EntityMetaKey.Selector].playlistId != null ?
						resolve('/youtube/playlist/[playlistId=stringSegment]', {
					playlistId: encodeURIComponent(String(youtubePlaylist[EntityMetaKey.Selector].playlistId ?? '')),
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
				{[String((youtubePlaylistFields.title) ?? '')].filter(Boolean).join(' ') || [String((youtubePlaylistFields.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist'}
			{/snippet}

			{#snippet Value()}
				{[[String((youtubePlaylistFields.$channel.title) ?? '')].filter(Boolean).join(' ') || [String((youtubePlaylistFields.$channel.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
