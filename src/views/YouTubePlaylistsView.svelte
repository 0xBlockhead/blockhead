<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
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

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				entityFieldReference.entityType === EntityType.YouTubeNetwork ?
					{
						sources: [
							Source.Constants_Internal,
							Source.Youtube_Rest,
						],
						fields: {
							[entityFieldReference.fieldName]: {
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
								],
								limit,
							},
						},
					}
				:
					{
						sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
						fields: {
							[entityFieldReference.fieldName]: {
								sources: [
									Source.Youtube_Rest,
									Source.Piped_Rest,
								],
								limit,
							},
						},
					},
			)}
			<ResourceBoundary
				resource={parent}
				placeholderText="Loading playlists…"
			>
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.YouTubePlaylist}
						id={`${id}-items`}
						{title}
						items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
						placeholderText="Loading playlists…"
						getKey={(playlist) => stringify(playlist[EntityMetaKey.Selector])}
						getSortValue={(playlist) => stringify(playlist[EntityMetaKey.Selector])}
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
								selector={playlist[EntityMetaKey.Selector]}
								layout={EntityLayout.SummaryDetails}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
