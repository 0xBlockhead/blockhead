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
		title = 'Reddit observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalRedditNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalRedditNetwork_Timestamp>
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
	entityType={EntityType._GlobalRedditNetwork_Timestamp}
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
				reachable: true,
				observedLinkCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalRedditNetworkTimestamps) => [...new Map(globalRedditNetworkTimestamps.values.map((globalRedditNetworkTimestamp) => [globalRedditNetworkTimestamp[EntityMetaKey.SelectorKey], globalRedditNetworkTimestamp])).values()]}
	getKey={(globalRedditNetworkTimestamp) => globalRedditNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global Reddit network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalRedditNetworkTimestamp })}
		{@const globalRedditNetworkTimestampFields = { ...globalRedditNetworkTimestamp[EntityMetaKey.Selector], ...globalRedditNetworkTimestamp }}
		<EntityView
			entityType={EntityType._GlobalRedditNetwork_Timestamp}
			entitySelector={globalRedditNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((globalRedditNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global Reddit network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((globalRedditNetworkTimestampFields.source) ?? ''), String((globalRedditNetworkTimestampFields.reachable) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((globalRedditNetworkTimestampFields.observedLinkCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
