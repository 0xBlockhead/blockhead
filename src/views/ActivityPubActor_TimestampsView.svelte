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
		title = 'ActivityPub actor observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading ActivityPub actor observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubActor_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.ActivityPubActor_Timestamp>
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
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
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
					$actor: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubActor_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(activityPubActorTimestamps)}
			{@const uniqueActivityPubActorTimestamps = [...new Map(activityPubActorTimestamps.values.map((activityPubActorTimestamp) => [activityPubActorTimestamp[EntityMetaKey.SelectorKey], activityPubActorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.ActivityPubActor_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={activityPubActorTimestamps.values.length === uniqueActivityPubActorTimestamps.length && activityPubActorTimestamps.totalCount != null && activityPubActorTimestamps.totalCount >= uniqueActivityPubActorTimestamps.length ? activityPubActorTimestamps.totalCount : uniqueActivityPubActorTimestamps.length}
				getKey={(activityPubActorTimestamp) => activityPubActorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueActivityPubActorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ActivityPub actor observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: activityPubActorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.ActivityPubActor_Timestamp> })}
					<ActivityPubActor_TimestampView
						href={
							resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
								instanceOrigin: String(activityPubActorTimestamp.entitySelector.$actor.instanceOrigin),
								localAccountId: String(activityPubActorTimestamp.entitySelector.$actor.localAccountId),
								timestampMs: String(activityPubActorTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.ActivityPubActor_Timestamp, activityPubActorTimestamp.entitySelector)}
						prefetched={activityPubActorTimestamp}
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
		entityType={EntityType.ActivityPubActor_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
