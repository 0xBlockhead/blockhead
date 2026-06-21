<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/youtube'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeNetwork}
	entitySelector={selection.entitySelector}
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
				resource={selection( { sources: [
						Source.Constants_Internal,
					], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true, $$youtubeChannels: ({ sources: [
									Source.Constants_Internal,
								] }), $$youtubePlaylists: ({ sources: [
									Source.Constants_Internal,
								] }) }) : ({  })) } })}
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
							<dd>{String(network.$$youtubeChannels?.values.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Playlists</dt>
							<dd>{String(network.$$youtubePlaylists?.values.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open && network.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.homeUrl}>{network.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={network.docsUrl}>{network.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.topology}
						<div>
							<dt>Topology</dt>
							<dd>{network.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkSelectorKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-registry`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
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

			{#snippet SectionPlaylists({ id, label })}
				<YouTubePlaylistsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/youtube/playlists')}
					selection={selection.$$youtubePlaylists}
					id="playlists"
					open={_open}
					title="Playlists"
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
