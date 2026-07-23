<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'AT Protocol hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalAtprotoNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalAtprotoNetwork_Timestamp>
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
	entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
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
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalAtprotoNetworkTimestamps) => [...new Map(globalAtprotoNetworkTimestamps.values.map((globalAtprotoNetworkTimestamp) => [globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey], globalAtprotoNetworkTimestamp])).values()]}
	getKey={(globalAtprotoNetworkTimestamp) => globalAtprotoNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol hub observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalAtprotoNetworkTimestamp })}
		{@const globalAtprotoNetworkTimestampFields = { ...globalAtprotoNetworkTimestamp[EntityMetaKey.Selector], ...globalAtprotoNetworkTimestamp }}
		<EntityView
			entityType={EntityType._GlobalAtprotoNetwork_Timestamp}
			entitySelector={globalAtprotoNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((globalAtprotoNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol hub observation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((globalAtprotoNetworkTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
