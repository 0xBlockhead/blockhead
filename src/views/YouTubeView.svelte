<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/youtube'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.YouTubeNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const network = subscribe(EntityType.YouTubeNetwork,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true, $$youtubeChannels: ({ sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						] }), $$youtubeVideos: ({ sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						] }), $$youtubePlaylists: ({ sources: [
							Source.Constants_Internal,
							Source.Youtube_Rest,
						] }) }) : ({  })) } }),
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeChannelsView from '$/views/YouTubeChannelsView.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeNetwork}
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="YouTube"
>
	{#snippet Value()}
		YouTube
	{/snippet}

	{#snippet Title()}
		YouTube
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Channels and videos resolve through Google’s YouTube Data API when configured, with Piped as a read-only fallback for the same UC… / 11-char ids.
		</p>
		<p>
			Hub playlist discovery uses curated seeds plus YouTube Data API channel playlist lists when configured; Piped backs channel-scoped playlists but not the network playlist carousel.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={network}
				placeholderText="Loading YouTube hub directory…"
			>
				{#snippet children(network)}
					{#if network.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{network.fields.registryLabel}</dd>
						</div>
					{:else if network.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{network.fields.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Channels</dt>
							<dd>{String(network.fields.$$youtubeChannels?.values.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Videos</dt>
							<dd>{String(network.fields.$$youtubeVideos?.values.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Playlists</dt>
							<dd>{String(network.fields.$$youtubePlaylists?.values.length)}</dd>
						</div>
					{/if}

					{#if open && network.fields.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.fields.homeUrl}>{network.fields.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.fields.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={network.fields.docsUrl}>{network.fields.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.fields.topology}
						<div>
							<dt>Topology</dt>
							<dd>{network.fields.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkSelectorKey = stringify(selector)}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-registry`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
				{ id: 'channels', label: 'Channels' },
				{ id: 'videos', label: 'Popular videos' },
				{ id: 'playlists', label: 'Playlists' },
			])}
			data-card
			scrollContainerProps={entityViewDetailCarouselScrollProps}
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Popular index
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionChannels({ id, label })}
				<YouTubeChannelsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/youtube/channels')}
					entityFieldReference={{
						entityType: EntityType.YouTubeNetwork,
						selector,
						fieldName: '$$youtubeChannels',
					}}
					id="channels"
					open={_open}
				/>
			{/snippet}

			{#snippet SectionVideos({ id, label })}
				<YouTubeVideosView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/youtube/videos')}
					entityFieldReference={{
						entityType: EntityType.YouTubeNetwork,
						selector,
						fieldName: '$$youtubeVideos',
					}}
					id="videos"
					limit={25}
					open={_open}
					title="Popular videos"
				/>
			{/snippet}

			{#snippet SectionPlaylists({ id, label })}
				<YouTubePlaylistsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/youtube/playlists')}
					entityFieldReference={{
						entityType: EntityType.YouTubeNetwork,
						selector,
						fieldName: '$$youtubePlaylists',
					}}
					id="playlists"
					open={_open}
					title="Playlists"
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
