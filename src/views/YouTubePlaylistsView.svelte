<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'
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
		title = 'Playlists',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubePlaylist>
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
	import YouTubePlaylistView from '$/views/YouTubePlaylistView.svelte'
</script>


<EntitiesList
	entityType={EntityType.YouTubePlaylist}
	{href}
	{id}
	{title}
	bind:open
	{collapsible}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			YouTube playlists group ordered video ids under a curator channel—not Reddit threads or Nostr events.
		</p>
		<p>
			Playlist ids are opaque strings from the Data API; items resolve to 11-character watch keys.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No playlists in this scope yet.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.YouTubeNetwork ?
						{
							$: [
								Source.Constants_Internal,
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							[fieldName]: {
								$: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
									Source.Piped_Rest,
								],
								limit,
							},
						}
					:
						{
							$: [
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
						}
				),
			)}
			{@const playlists = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.YouTubePlaylist>[] = (
						parent[fieldName] ?? []
					)
					return (
						rows.map((playlist) => ({
							entityId: playlist[EntityMetaKey.Id],
							sortKey: playlist[EntityMetaKey.IdKey],
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubePlaylist}
				{href}
				id={`${id}-items`}
				{title}
				resource={playlists}
				placeholderText="Loading playlists…"
				getKey={(row) => stringify(row.entityId)}
				getSortValue={(row) => row.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No playlists in this scope yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: row,
				})}
					{#if row}
						<YouTubePlaylistView
							entityId={row.entityId}
							href={resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
								playlistId: encodeURIComponent(row.entityId.playlistId),
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
