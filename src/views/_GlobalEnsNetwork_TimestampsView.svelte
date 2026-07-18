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
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalEnsNetwork_Timestamp>
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
	import GlobalEnsNetwork_TimestampView from '$/views/_GlobalEnsNetwork_TimestampView.svelte'
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
		{@const selection = select(EntityType._GlobalEnsNetwork_Timestamp, globalEnsNetworkTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const globalEnsNetworkTimestampHrefFields = { ...globalEnsNetworkTimestamp, ...globalEnsNetworkTimestamp[EntityMetaKey.Selector] }}
		<GlobalEnsNetwork_TimestampView
			selection={selection}
			prefetched={globalEnsNetworkTimestampFields}
			href={
				(globalEnsNetworkTimestampHrefFields.timestampMs !== undefined && globalEnsNetworkTimestampHrefFields.source !== undefined ? resolve('/ens/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(globalEnsNetworkTimestampHrefFields.timestampMs ?? ''),
					source: String(globalEnsNetworkTimestampHrefFields.source ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
