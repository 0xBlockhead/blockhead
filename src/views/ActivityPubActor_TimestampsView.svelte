<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ActivityPub actor observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubActor_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubActor_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubActor_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$actor: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(activityPubActorTimestamps) => [...new Map(activityPubActorTimestamps.values.map((activityPubActorTimestamp) => [activityPubActorTimestamp[EntityMetaKey.SelectorKey], activityPubActorTimestamp])).values()]}
	getKey={(activityPubActorTimestamp) => activityPubActorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub actor observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubActorTimestamp })}
		{@const activityPubActorTimestampFields = { ...activityPubActorTimestamp[EntityMetaKey.Selector], ...activityPubActorTimestamp }}
		{@const selection = select(EntityType.ActivityPubActor_Timestamp, activityPubActorTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubActorTimestampHrefFields = { ...activityPubActorTimestamp, ...activityPubActorTimestamp[EntityMetaKey.Selector] }}
		<ActivityPubActor_TimestampView
			selection={selection}
			prefetched={activityPubActorTimestampFields}
			href={
				(activityPubActorTimestampHrefFields.timestampMs !== undefined && activityPubActorTimestampHrefFields.source !== undefined && activityPubActorTimestampHrefFields.$actor !== undefined && activityPubActorTimestampHrefFields.$actor.instanceOrigin !== undefined && activityPubActorTimestampHrefFields.$actor.localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubActorTimestampHrefFields.timestampMs ?? ''),
					source: String(activityPubActorTimestampHrefFields.source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubActorTimestampHrefFields.$actor.instanceOrigin ?? '')),
					localAccountId: String(activityPubActorTimestampHrefFields.$actor.localAccountId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
