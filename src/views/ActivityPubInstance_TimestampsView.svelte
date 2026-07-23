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
		title = 'ActivityPub instance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubInstance_Timestamp>
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
	entityType={EntityType.ActivityPubInstance_Timestamp}
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
				title: true,
				timestampMs: true,
				$instance: true,
				source: true,
				version: true,
			},
		})
	}
	{countResource}
	getResourceItems={(activityPubInstanceTimestamps) => [...new Map(activityPubInstanceTimestamps.values.map((activityPubInstanceTimestamp) => [activityPubInstanceTimestamp[EntityMetaKey.SelectorKey], activityPubInstanceTimestamp])).values()]}
	getKey={(activityPubInstanceTimestamp) => activityPubInstanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub instance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubInstanceTimestamp })}
		{@const activityPubInstanceTimestampFields = { ...activityPubInstanceTimestamp[EntityMetaKey.Selector], ...activityPubInstanceTimestamp }}
		<EntityView
			entityType={EntityType.ActivityPubInstance_Timestamp}
			entitySelector={activityPubInstanceTimestamp[EntityMetaKey.Selector]}
			href={
				(
					activityPubInstanceTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in activityPubInstanceTimestamp[EntityMetaKey.Selector]
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector] != null && 'source' in activityPubInstanceTimestamp[EntityMetaKey.Selector]
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector].source != null
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector] != null && '$instance' in activityPubInstanceTimestamp[EntityMetaKey.Selector]
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector].$instance != null && 'instanceOrigin' in activityPubInstanceTimestamp[EntityMetaKey.Selector].$instance
					&& activityPubInstanceTimestamp[EntityMetaKey.Selector].$instance.instanceOrigin != null ?
						resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubInstanceTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(activityPubInstanceTimestamp[EntityMetaKey.Selector].source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubInstanceTimestamp[EntityMetaKey.Selector].$instance.instanceOrigin ?? '')),
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
				{[String((activityPubInstanceTimestampFields.title) ?? ''), String((activityPubInstanceTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance observation'}
			{/snippet}

			{#snippet Value()}
				{[[String((activityPubInstanceTimestampFields.$instance.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance', String((activityPubInstanceTimestampFields.source) ?? ''), String((activityPubInstanceTimestampFields.version) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
