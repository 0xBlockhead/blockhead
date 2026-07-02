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
		placeholderText = 'Loading Lens post observations...',
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
			selection.sources == null ? selection({
				fields: {
					$post: true,
					timestampMs: true,
				},
			}) : selection
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
				totalCount={lensPostTimestamps.values.length === uniqueLensPostTimestamps.length && lensPostTimestamps.totalCount != null && lensPostTimestamps.totalCount >= uniqueLensPostTimestamps.length ? lensPostTimestamps.totalCount : uniqueLensPostTimestamps.length}
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
					<LensPost_TimestampView
						href={
							resolve('/(social)/(lens)/lens/post/[postId]/(post)/observations/[timestampMs=nonNegativeInteger]', {
								postId: String(lensPostTimestamp.entitySelector.$post.id),
								timestampMs: String(lensPostTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.LensPost_Timestamp, lensPostTimestamp.entitySelector)}
						prefetched={lensPostTimestamp}
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
