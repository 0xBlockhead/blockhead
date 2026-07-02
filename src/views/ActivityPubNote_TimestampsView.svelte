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
		title = 'ActivityPub note observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading ActivityPub note observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubNote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubNote_Timestamp>
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
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
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
					$note: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubNote_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(activityPubNoteTimestamps)}
			{@const uniqueActivityPubNoteTimestamps = [...new Map(activityPubNoteTimestamps.values.map((activityPubNoteTimestamp) => [activityPubNoteTimestamp[EntityMetaKey.SelectorKey], activityPubNoteTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubNote_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={activityPubNoteTimestamps.values.length === uniqueActivityPubNoteTimestamps.length && activityPubNoteTimestamps.totalCount != null && activityPubNoteTimestamps.totalCount >= uniqueActivityPubNoteTimestamps.length ? activityPubNoteTimestamps.totalCount : uniqueActivityPubNoteTimestamps.length}
				getKey={(activityPubNoteTimestamp) => activityPubNoteTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueActivityPubNoteTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ActivityPub note observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: activityPubNoteTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ActivityPubNote_Timestamp> })}
					<ActivityPubNote_TimestampView
						href={
							resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/observations/[timestampMs=nonNegativeInteger]', {
								instanceOrigin: String(activityPubNoteTimestamp.entitySelector.$note.instanceOrigin),
								localStatusId: String(activityPubNoteTimestamp.entitySelector.$note.localStatusId),
								timestampMs: String(activityPubNoteTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.ActivityPubNote_Timestamp, activityPubNoteTimestamp.entitySelector)}
						prefetched={activityPubNoteTimestamp}
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
		entityType={EntityType.ActivityPubNote_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
