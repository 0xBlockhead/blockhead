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
		title = 'ActivityPub hub observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalActivityPubNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalActivityPubNetwork_Timestamp>
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
	entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
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
				instanceTitle: true,
				timestampMs: true,
				instanceOrigin: true,
				source: true,
				reachable: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalActivityPubNetworkTimestamps) => [...new Map(globalActivityPubNetworkTimestamps.values.map((globalActivityPubNetworkTimestamp) => [globalActivityPubNetworkTimestamp[EntityMetaKey.SelectorKey], globalActivityPubNetworkTimestamp])).values()]}
	getKey={(globalActivityPubNetworkTimestamp) => globalActivityPubNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global ActivityPub network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalActivityPubNetworkTimestamp })}
		{@const globalActivityPubNetworkTimestampFields = { ...globalActivityPubNetworkTimestamp[EntityMetaKey.Selector], ...globalActivityPubNetworkTimestamp }}
		<EntityView
			entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
			entitySelector={globalActivityPubNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((globalActivityPubNetworkTimestampFields.instanceTitle) ?? ''), String((globalActivityPubNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global ActivityPub network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((globalActivityPubNetworkTimestampFields.instanceOrigin) ?? ''), String((globalActivityPubNetworkTimestampFields.source) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((globalActivityPubNetworkTimestampFields.reachable) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
