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
		title = 'YouTube videos',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube videos...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideos-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeVideo>
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
	import Timestamp from '$/components/Timestamp.svelte'
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
					videoId: true,
					publishedAtMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeVideo}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubeVideos)}
			{@const uniqueYoutubeVideos = [...new Map(youtubeVideos.values.map((youtubeVideo) => [youtubeVideo[EntityMetaKey.SelectorKey], youtubeVideo])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeVideo}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeVideos.values.length === uniqueYoutubeVideos.length && youtubeVideos.totalCount != null && youtubeVideos.totalCount >= uniqueYoutubeVideos.length ? youtubeVideos.totalCount : uniqueYoutubeVideos.length}
				getKey={(youtubeVideo) => youtubeVideo[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeVideos}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube videos yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeVideo }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeVideo> })}
					<EntityView
						entityType={EntityType.YoutubeVideo}
						entitySelector={youtubeVideo.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const title0 = ({ ...youtubeVideo.entitySelector, ...youtubeVideo }).title}
							{String((title0) ?? '')}
							{@const videoId1 = ({ ...youtubeVideo.entitySelector, ...youtubeVideo }).videoId}
							<TruncatedValue value={String(videoId1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const publishedAtMsAfter0 = ({ ...youtubeVideo.entitySelector, ...youtubeVideo }).publishedAtMs}
							{#if publishedAtMsAfter0 != null}
								<span data-text="muted">
									<Timestamp timestamp={Number(publishedAtMsAfter0)} />
								</span>
							{/if}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubeVideo}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
