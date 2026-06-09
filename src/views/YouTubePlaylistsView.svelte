<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
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
		title = 'Playlists',
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.YouTubePlaylist>
			id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YouTubePlaylistView from '$/views/YouTubePlaylistView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.YouTubePlaylist}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			YouTube playlists group ordered video ids under a curator channel—not Reddit threads or Nostr events.
		</p>
		<p>
			Channel-scoped lists use YouTube Data API or Piped channel tabs; the network hub carousel uses seeds plus Data API only.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No playlists in this scope yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.YouTubeNetwork ?
							{
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
								],
								$$youtubePlaylists: {
									sources: [
										Source.Constants_Internal,
										Source.Youtube_Rest,
								],
								limit: limit,
							},
						}
					:
							{
								sources: [
									Source.Youtube_Rest,
									Source.Piped_Rest,
								],
								$$playlists: {
									sources: [
										Source.Youtube_Rest,
										Source.Piped_Rest,
								],
								limit: limit,
							},
						}
				),
			)}
			{@const playlists = derive(
				parent,
				(parent) => {
					const youTubePlaylists: readonly Entity<typeof schema, EntityType.YouTubePlaylist>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						youTubePlaylists.map((playlist) => ({
							entityId: playlist[EntityMetaKey.Id],
							sortKey: stringify(playlist[EntityMetaKey.Id]),
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.YouTubePlaylist}
				id={`${id}-items`}
				{title}
				resource={playlists}
				placeholderText="Loading playlists…"
				getKey={(playlist) => stringify(playlist.entityId)}
				getSortValue={(playlist) => playlist.sortKey}
				placeholderKeys={new SvelteSet<string>()}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No playlists in this scope yet.
					</p>
				{/snippet}

				{#snippet Item({
					item: playlist,
				})}
					<YouTubePlaylistView
						entityId={playlist.entityId}
						layout={EntityLayout.SummaryDetails}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
