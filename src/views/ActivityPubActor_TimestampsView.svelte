<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubActor_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.ActivityPubActor_Timestamp}
			entitySelector={activityPubActorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					activityPubActorTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in activityPubActorTimestamp[EntityMetaKey.Selector]
					&& activityPubActorTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& activityPubActorTimestamp[EntityMetaKey.Selector] != null && 'source' in activityPubActorTimestamp[EntityMetaKey.Selector]
					&& activityPubActorTimestamp[EntityMetaKey.Selector].source != null
					&& activityPubActorTimestamp[EntityMetaKey.Selector] != null && '$actor' in activityPubActorTimestamp[EntityMetaKey.Selector]
					&& activityPubActorTimestamp[EntityMetaKey.Selector].$actor != null && 'instanceOrigin' in activityPubActorTimestamp[EntityMetaKey.Selector].$actor
					&& activityPubActorTimestamp[EntityMetaKey.Selector].$actor.instanceOrigin != null
					&& activityPubActorTimestamp[EntityMetaKey.Selector].$actor != null && 'localAccountId' in activityPubActorTimestamp[EntityMetaKey.Selector].$actor
					&& activityPubActorTimestamp[EntityMetaKey.Selector].$actor.localAccountId != null ?
						resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubActorTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(activityPubActorTimestamp[EntityMetaKey.Selector].source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubActorTimestamp[EntityMetaKey.Selector].$actor.instanceOrigin ?? '')),
					localAccountId: String(activityPubActorTimestamp[EntityMetaKey.Selector].$actor.localAccountId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((activityPubActorTimestampFields.$actor.displayName) ?? ''), String((activityPubActorTimestampFields.$actor.acct) ?? ''), String((activityPubActorTimestampFields.$actor.username) ?? ''), String((activityPubActorTimestampFields.$actor.localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor'].filter(Boolean).join(' ') || 'ActivityPub actor observation'}
			{/snippet}

			{#snippet Value()}
				{[String((activityPubActorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
