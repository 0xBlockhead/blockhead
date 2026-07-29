<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalYoutubeNetwork> = $props()

	const viewDomId = $derived('-global-youtube-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalYoutubeNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'YouTube'}
	href={
		href === undefined ?
			resolve('/(social)/(youtube)/youtube')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		YouTube
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					YouTube
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-youtube-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'youtube-channels',
						label: 'Popular-chart channels',
					},
					{
						id: 'youtube-videos',
						label: 'Popular videos (provider-default region and category; Piped US)',
					},
					{
						id: 'youtube-playlists',
						label: 'Seeded-channel playlists',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Bounded discovery</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionYoutubeChannels({ id, label, open })}
				<YoutubeChannelsView
					selection={selection.$$observedChannels}
					href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channels')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionYoutubeVideos({ id, label, open })}
				<YoutubeVideosView
					selection={selection.$$observedVideos}
					href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/videos')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionYoutubePlaylists({ id, label, open })}
				<YoutubePlaylistsView
					selection={selection.$$observedPlaylists}
					href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlists')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
