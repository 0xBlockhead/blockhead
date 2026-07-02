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


	// State
	let {
		selection,
		title = 'YouTube comments',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube comments...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeComments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeComment>
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
				fields: {
					authorDisplayName: true,
					text: true,
					publishedAtMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeComment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubeComments)}
			{@const uniqueYoutubeComments = [...new Map(youtubeComments.values.map((youtubeComment) => [youtubeComment[EntityMetaKey.SelectorKey], youtubeComment])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeComment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeComments.values.length === uniqueYoutubeComments.length && youtubeComments.totalCount != null && youtubeComments.totalCount >= uniqueYoutubeComments.length ? youtubeComments.totalCount : uniqueYoutubeComments.length}
				getKey={(youtubeComment) => youtubeComment[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeComments}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube comments yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeComment }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeComment> })}
					<EntityView
						entityType={EntityType.YoutubeComment}
						entitySelector={youtubeComment.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const authorDisplayName0 = ({ ...youtubeComment.entitySelector, ...youtubeComment }).authorDisplayName}
							{String((authorDisplayName0) ?? '')}
							{@const text1 = ({ ...youtubeComment.entitySelector, ...youtubeComment }).text}
							<TruncatedValue value={String(text1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const publishedAtMsAfter0 = ({ ...youtubeComment.entitySelector, ...youtubeComment }).publishedAtMs}
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
		entityType={EntityType.YoutubeComment}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
