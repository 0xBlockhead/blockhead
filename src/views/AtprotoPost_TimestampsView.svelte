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


	// State
	let {
		selection,
		title = 'AT Protocol post observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading AT Protocol post observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoPost_Timestamp>
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
	import NumberValue from '$/components/NumberValue.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
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
					timestampMs: true,
					likeCount: true,
					replyCount: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(atprotoPostTimestamps)}
			{@const uniqueAtprotoPostTimestamps = [...new Map(atprotoPostTimestamps.values.map((atprotoPostTimestamp) => [atprotoPostTimestamp[EntityMetaKey.SelectorKey], atprotoPostTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={atprotoPostTimestamps.values.length === uniqueAtprotoPostTimestamps.length && atprotoPostTimestamps.totalCount != null && atprotoPostTimestamps.totalCount >= uniqueAtprotoPostTimestamps.length ? atprotoPostTimestamps.totalCount : uniqueAtprotoPostTimestamps.length}
				getKey={(atprotoPostTimestamp) => atprotoPostTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAtprotoPostTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol post observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: atprotoPostTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AtprotoPost_Timestamp> })}
					<EntityView
						entityType={EntityType.AtprotoPost_Timestamp}
						entitySelector={atprotoPostTimestamp.entitySelector}
						href={
							resolve('/(social)/(atproto)/atproto/post/[...uri]/(post)/observations/[timestampMs=nonNegativeInteger]', {
								uri: String(({ ...atprotoPostTimestamp.entitySelector, ...atprotoPostTimestamp }).$post.uri),
								timestampMs: String(({ ...atprotoPostTimestamp.entitySelector, ...atprotoPostTimestamp }).timestampMs),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const timestampMs0 = ({ ...atprotoPostTimestamp.entitySelector, ...atprotoPostTimestamp }).timestampMs}
							<Timestamp timestamp={Number(timestampMs0)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const likeCountAfter0 = ({ ...atprotoPostTimestamp.entitySelector, ...atprotoPostTimestamp }).likeCount}
							{#if likeCountAfter0 != null}
								<span data-text="muted">
									<NumberValue value={Number(likeCountAfter0)} />

									<span> likes</span>
									 likes
								</span>
							{/if}
							{@const replyCountAfter1 = ({ ...atprotoPostTimestamp.entitySelector, ...atprotoPostTimestamp }).replyCount}
							{#if replyCountAfter1 != null}
								<span data-text="muted">
									<NumberValue value={Number(replyCountAfter1)} />

									<span> replies</span>
									 replies
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
		entityType={EntityType.AtprotoPost_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
