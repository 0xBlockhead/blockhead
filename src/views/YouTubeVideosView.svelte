<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Videos',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubeVideo>
		href: string
		id: string
		limit?: number
		open?: boolean
		title?: string
	} = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
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
		entityType={EntityType.YouTubeVideo}
		{href}
		{id}
		{title}
		bind:open
		{collapsible}
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

		{#snippet body()}
			{#if open}
				{@const fieldName = entityFieldReference.fieldName}
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						$: [
							Source.Constants_Internal,
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						[fieldName]: {
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
						const rows: Entity<typeof schema, EntityType.YouTubeVideo>[] = (
							parent[fieldName] ?? []
						)
						return (
							rows.map((video) => ({
								...video[EntityMetaKey.Id],
								sortKey: video[EntityMetaKey.IdKey],
							}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.YouTubeVideo}
					{href}
					id={`${id}-items`}
					{title}
					resource={videos}
					placeholderText="Loading videos…"
					getKey={(row) => row.videoId}
					getSortValue={(row) => row.sortKey}
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
						item: row,
					})}
						{#if row}
							<YouTubeVideoView
								entityId={{ videoId: row.videoId }}
								href={resolve('/(social)/(youtube)/youtube/video/[videoId]', {
									videoId: encodeURIComponent(row.videoId),
								})}
								layout={EntityLayout.SummaryDetails}
								open={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
