<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
			channelId: selection.entitySelector.channelId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeChannel>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const channel = $derived(
				selection(({ sources: [
						Source.Constants_Internal,
					], fields: {
					title: true,
				} }),
			)
		)

	const idKey = $derived(stringify(selection.entitySelector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeChannel}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
		{#snippet Value()}
		<span>
			{selection.entitySelector.channelId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{channel.title ?? selection.entitySelector.channelId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Channel ids are opaque UC… publisher keys from the Data API (or Piped); @handles in customUrl are aliases, not the primary id.
		</p>
		<p>
			Not Farcaster FIDs, wallet inboxes, or federated ActivityPub actors.
		</p>
	{/snippet}

		{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-channel`}
			sectionIdPrefix={idKey}
				sections={collapsibleTabsSections([
					{ id: 'videos', label: 'Videos' },
					{ id: 'playlists', label: 'Playlists' },
				])}
			data-card
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Channel library
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionVideos()}
				<YouTubeVideosView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$videos}
					id={`${idKey}:youtube-videos`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionPlaylists()}
				<YouTubePlaylistsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$playlists}
					id={`${idKey}:youtube-playlists`}
					open={_open}
				/>
			{/snippet}
			</CollapsibleTabs>
	{/snippet}
</EntityView>
