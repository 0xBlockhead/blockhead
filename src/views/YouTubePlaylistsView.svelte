<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'YouTube playlists',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube playlists...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubePlaylists-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubePlaylist>
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
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					title: true,
					playlistId: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubePlaylist}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubePlaylists)}
			{@const uniqueYoutubePlaylists = [...new Map(youtubePlaylists.values.map((youtubePlaylist) => [youtubePlaylist[EntityMetaKey.SelectorKey], youtubePlaylist])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubePlaylist}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubePlaylists.values.length === uniqueYoutubePlaylists.length && youtubePlaylists.totalCount != null && youtubePlaylists.totalCount >= uniqueYoutubePlaylists.length ? youtubePlaylists.totalCount : uniqueYoutubePlaylists.length}
				getKey={(youtubePlaylist) => youtubePlaylist[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubePlaylists}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube playlists yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubePlaylist }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubePlaylist> })}
					<EntityView
						entityType={EntityType.YoutubePlaylist}
						entitySelector={youtubePlaylist.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const title0 = ({ ...youtubePlaylist.entitySelector, ...youtubePlaylist }).title}
							{String((title0) ?? '')}
							{@const playlistId1 = ({ ...youtubePlaylist.entitySelector, ...youtubePlaylist }).playlistId}
							<TruncatedValue value={String(playlistId1)} />
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubePlaylist}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
