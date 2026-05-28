<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/youtube',
			entityId,
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.YouTubeNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					homeUrl: {},
					docsUrl: {},
					topology: {},
					$$youtubeChannels: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
					$$youtubeVideos: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
					$$youtubePlaylists: {
						$: [
							Source.Constants_Internal,
							Source.Youtube_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeChannelsView from '$/views/YouTubeChannelsView.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeNetwork}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="YouTube"
>
	{#snippet Value()}
		{entityId.scope}

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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={network}
				placeholderText="Loading YouTube hub directory…"
			>
				{#snippet children(network)}
					{#if network.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{network.registryLabel}</dd>
						</div>
					{:else if network.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{network.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Channels</dt>
							<dd>{String(network.$$youtubeChannels.length)}</dd>
						</div>
						<div>
							<dt>Videos</dt>
							<dd>{String(network.$$youtubeVideos.length)}</dd>
						</div>
						<div>
							<dt>Playlists</dt>
							<dd>{String(network.$$youtubePlaylists.length)}</dd>
						</div>

						{#if network.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={network.homeUrl}>{network.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if network.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={network.docsUrl}>{network.docsUrl}</a>
								</dd>
							</div>
						{/if}

						{#if network.topology}
							<div>
								<dt>Topology</dt>
								<dd>{network.topology}</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkIdKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.YouTubeNetwork}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'channels', label: 'Channels' },
					{ id: 'videos', label: 'Popular videos' },
					{ id: 'playlists', label: 'Playlists' },
				]}
				{...{ 'data-card': '' }}
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
						href={resolve('/youtube/channels')}
						entityFieldReference={{
							entityType: EntityType.YouTubeNetwork,
							entityId,
							fieldName: '$$youtubeChannels',
						}}
						id="channels"
						open={_open}
					/>
				{/snippet}

				{#snippet SectionVideos({ id, label })}
					<YouTubeVideosView
						href={resolve('/youtube/videos')}
						entityFieldReference={{
							entityType: EntityType.YouTubeNetwork,
							entityId,
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
						href={resolve('/youtube/playlists')}
						entityFieldReference={{
							entityType: EntityType.YouTubeNetwork,
							entityId,
							fieldName: '$$youtubePlaylists',
						}}
						id="playlists"
						open={_open}
						title="Playlists"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
