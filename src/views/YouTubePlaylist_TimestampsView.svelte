<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'YouTube playlist observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubePlaylist_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubePlaylist_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YoutubePlaylist_TimestampView from '$/views/YoutubePlaylist_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$playlist: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubePlaylist_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(youtubePlaylistTimestamps)}
			{@const uniqueYoutubePlaylistTimestamps = [...new Map(youtubePlaylistTimestamps.values.map((youtubePlaylistTimestamp) => [youtubePlaylistTimestamp[EntityMetaKey.SelectorKey], youtubePlaylistTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubePlaylist_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubePlaylistTimestamps.totalCount}
				getKey={(youtubePlaylistTimestamp) => youtubePlaylistTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubePlaylistTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube playlist observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubePlaylistTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubePlaylist_Timestamp> })}
					{@const youtubePlaylistTimestampFields = { ...youtubePlaylistTimestamp[EntityMetaKey.Selector], ...youtubePlaylistTimestamp }}
					{@const youtubePlaylistTimestampHrefFields = { ...youtubePlaylistTimestamp, ...youtubePlaylistTimestamp[EntityMetaKey.Selector] }}
					<YoutubePlaylist_TimestampView
						selection={select(EntityType.YoutubePlaylist_Timestamp, youtubePlaylistTimestamp[EntityMetaKey.Selector])}
						prefetched={youtubePlaylistTimestampFields}
						href={
							(youtubePlaylistTimestampHrefFields.$playlist !== undefined && youtubePlaylistTimestampHrefFields.$playlist.playlistId !== undefined && youtubePlaylistTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]', {
								playlistId: String(youtubePlaylistTimestampHrefFields.$playlist.playlistId ?? ''),
								timestampMs: String(youtubePlaylistTimestampHrefFields.timestampMs ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubePlaylist_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
