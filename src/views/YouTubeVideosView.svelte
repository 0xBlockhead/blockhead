<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Videos',
	}: {
		selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
		id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import YouTubeVideoView from '$/views/YouTubeVideoView.svelte'
</script>


<div data-column="gap-2">
	<div data-row="wrap align-center gap-2">
		<Tooltip contentProps={{ side: 'top' }}>
			{#snippet Content()}
				<p>
					Videos use 11-character watch ids from Youtube_Rest, Piped_Rest, or curated seeds on the network hub.
				</p>
				<p>
					Not Reddit submissions, Nostr notes, or IPFS blobs.
				</p>
			{/snippet}
			<abbr
				class="entity-heading-tip"
				aria-label="About videos"
			>ⓘ</abbr>
		</Tooltip>
	</div>

	<EntitiesList
		{CollapsibleProps}
		entityType={EntityType.YouTubeVideo}
		{id}
		{title}
		bind:open
		{collapsible}
		{href}
	>
		{#snippet Empty()}
			<div data-row="wrap align-center gap-2">
				<p data-text="muted">
					No YouTube videos here yet.
				</p>
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>
							Rows are watchable uploads on YouTube itself.
						</p>
						<p>
							They are not social casts or decentralized storage objects.
						</p>
					{/snippet}
					<abbr
						class="entity-heading-tip"
						aria-label="About YouTube videos"
					>ⓘ</abbr>
				</Tooltip>
			</div>
		{/snippet}

		{#snippet body({ open: _bodyOpen })}
			{#if open}
				<ResourceBoundary
					resource={selection({
							sources: [
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							limit,
						})}
					placeholderText="Loading videos…"
				>
					{#snippet children(videos)}
						<EntitiesList
							collapsible={false}
							showSummary={false}
							entityType={EntityType.YouTubeVideo}
							id={`${id}-items`}
							{title}
							items={videos.entities}
							placeholderText="Loading videos…"
							getKey={(video) => video.entitySelector.videoId}
							getSortValue={(video) => stringify(video.entitySelector)}
						>
							{#snippet Empty()}
								<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No YouTube videos here yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Rows are watchable uploads on YouTube itself.
										</p>
										<p>
											They are not social casts or decentralized storage objects.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="About YouTube videos"
									>ⓘ</abbr>
								</Tooltip>
							</div>
							{/snippet}

							{#snippet Item({ item })}
								<YouTubeVideoView
									selector={item.entitySelector}
									layout={EntityLayout.SummaryDetails}

								/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
