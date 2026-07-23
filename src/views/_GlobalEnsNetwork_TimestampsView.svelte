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
		title = 'ENS hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEnsNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalEnsNetwork_Timestamp>
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
	entityType={EntityType._GlobalEnsNetwork_Timestamp}
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
				$hub: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalEnsNetworkTimestamps) => [...new Map(globalEnsNetworkTimestamps.values.map((globalEnsNetworkTimestamp) => [globalEnsNetworkTimestamp[EntityMetaKey.SelectorKey], globalEnsNetworkTimestamp])).values()]}
	getKey={(globalEnsNetworkTimestamp) => globalEnsNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS hub observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalEnsNetworkTimestamp })}
		{@const globalEnsNetworkTimestampFields = { ...globalEnsNetworkTimestamp[EntityMetaKey.Selector], ...globalEnsNetworkTimestamp }}
		<EntityView
			entityType={EntityType._GlobalEnsNetwork_Timestamp}
			entitySelector={globalEnsNetworkTimestamp[EntityMetaKey.Selector]}
			href={
				(
					globalEnsNetworkTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in globalEnsNetworkTimestamp[EntityMetaKey.Selector]
					&& globalEnsNetworkTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& globalEnsNetworkTimestamp[EntityMetaKey.Selector] != null && 'source' in globalEnsNetworkTimestamp[EntityMetaKey.Selector]
					&& globalEnsNetworkTimestamp[EntityMetaKey.Selector].source != null ?
						resolve('/ens/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(globalEnsNetworkTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(globalEnsNetworkTimestamp[EntityMetaKey.Selector].source ?? ''),
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
				{['ENS'].filter(Boolean).join(' ') || 'ENS hub observation'}
			{/snippet}

			{#snippet Value()}
				{[String((globalEnsNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
