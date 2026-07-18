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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubePlaylist>
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
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
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
		{@const selection = select(EntityType.YoutubePlaylist, youtubePlaylist[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubePlaylistHrefFields = { ...youtubePlaylist, ...youtubePlaylist[EntityMetaKey.Selector] }}
		<YoutubePlaylistView
			selection={selection}
			prefetched={youtubePlaylistFields}
			href={
				(youtubePlaylistHrefFields.playlistId !== undefined ? resolve('/youtube/playlist/[playlistId=stringSegment]', {
					playlistId: encodeURIComponent(String(youtubePlaylistHrefFields.playlistId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
