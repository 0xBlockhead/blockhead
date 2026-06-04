<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
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
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeVideo>
			id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						$: [
							Source.Constants_Internal,
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						[entityFieldReference.fieldName]: {
							$: [
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							limit,
						},
					},
				)}
				{@const videos = derive(
					parent,
					(parent) => {
						const youTubeVideos: Entity<typeof schema, EntityType.YouTubeVideo>[] = (
							parent[entityFieldReference.fieldName] ?? []
						)
						return (
							youTubeVideos.map((video) => ({
								...video[EntityMetaKey.Id],
								sortKey: stringify(video[EntityMetaKey.Id]),
							}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.YouTubeVideo}
					id={`${id}-items`}
					{title}
					resource={videos}
					placeholderText="Loading videos…"
					getKey={(video) => video.videoId}
					getSortValue={(video) => video.sortKey}
					placeholderKeys={new SvelteSet<string>()}
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

					{#snippet Item({
						item: video,
					})}
						<YouTubeVideoView
							entityId={{ videoId: video.videoId }}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
