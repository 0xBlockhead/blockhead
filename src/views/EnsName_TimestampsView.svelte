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
		title = 'ENS name observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsName_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EnsName_Timestamp>
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
	entityType={EntityType.EnsName_Timestamp}
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
				$name: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ensNameTimestamps) => [...new Map(ensNameTimestamps.values.map((ensNameTimestamp) => [ensNameTimestamp[EntityMetaKey.SelectorKey], ensNameTimestamp])).values()]}
	getKey={(ensNameTimestamp) => ensNameTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS name observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensNameTimestamp })}
		{@const ensNameTimestampFields = { ...ensNameTimestamp[EntityMetaKey.Selector], ...ensNameTimestamp }}
		<EntityView
			entityType={EntityType.EnsName_Timestamp}
			entitySelector={ensNameTimestamp[EntityMetaKey.Selector]}
			href={
				(
					ensNameTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in ensNameTimestamp[EntityMetaKey.Selector]
					&& ensNameTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& ensNameTimestamp[EntityMetaKey.Selector] != null && 'source' in ensNameTimestamp[EntityMetaKey.Selector]
					&& ensNameTimestamp[EntityMetaKey.Selector].source != null
					&& ensNameTimestamp[EntityMetaKey.Selector] != null && '$name' in ensNameTimestamp[EntityMetaKey.Selector]
					&& ensNameTimestamp[EntityMetaKey.Selector].$name != null && 'name' in ensNameTimestamp[EntityMetaKey.Selector].$name
					&& ensNameTimestamp[EntityMetaKey.Selector].$name.name != null ?
						resolve('/ens/name/[ensName=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(ensNameTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(ensNameTimestamp[EntityMetaKey.Selector].source ?? ''),
					ensName: encodeURIComponent(String(ensNameTimestamp[EntityMetaKey.Selector].$name.name ?? '')),
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
				{[[String((ensNameTimestampFields.$name.name) ?? '')].filter(Boolean).join(' ') || 'ENS name'].filter(Boolean).join(' ') || 'ENS name observation'}
			{/snippet}

			{#snippet Value()}
				{[String((ensNameTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
