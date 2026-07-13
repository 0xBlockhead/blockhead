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
		title = 'Lens post observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensPost_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensPost_Timestamp>
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
	import LensPost_TimestampView from '$/views/LensPost_TimestampView.svelte'
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
					$post: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(lensPostTimestamps)}
			{@const uniqueLensPostTimestamps = [...new Map(lensPostTimestamps.values.map((lensPostTimestamp) => [lensPostTimestamp[EntityMetaKey.SelectorKey], lensPostTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensPost_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lensPostTimestamps.totalCount}
				getKey={(lensPostTimestamp) => lensPostTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueLensPostTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lens post observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lensPostTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LensPost_Timestamp> })}
					{@const lensPostTimestampFields = { ...lensPostTimestamp[EntityMetaKey.Selector], ...lensPostTimestamp }}
					{@const lensPostTimestampHrefFields = { ...lensPostTimestamp, ...lensPostTimestamp[EntityMetaKey.Selector] }}
					<LensPost_TimestampView
						selection={select(EntityType.LensPost_Timestamp, lensPostTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={lensPostTimestampFields}
						href={
							(lensPostTimestampHrefFields.timestampMs !== undefined && lensPostTimestampHrefFields.$post !== undefined && lensPostTimestampHrefFields.$post.id !== undefined ? resolve('/lens/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
								timestampMs: String(lensPostTimestampHrefFields.timestampMs ?? ''),
								postId: String(lensPostTimestampHrefFields.$post.id ?? ''),
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
		entityType={EntityType.LensPost_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
