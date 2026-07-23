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
		title = 'Bnb beacon network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BnbBeaconNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BnbBeaconNetwork_Timestamp>
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
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
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
				latestArchivedHeight: true,
				archiveCoverageStatus: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bnbBeaconNetworkTimestamps) => [...new Map(bnbBeaconNetworkTimestamps.values.map((bnbBeaconNetworkTimestamp) => [bnbBeaconNetworkTimestamp[EntityMetaKey.SelectorKey], bnbBeaconNetworkTimestamp])).values()]}
	getKey={(bnbBeaconNetworkTimestamp) => bnbBeaconNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bnb beacon network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bnbBeaconNetworkTimestamp })}
		{@const bnbBeaconNetworkTimestampFields = { ...bnbBeaconNetworkTimestamp[EntityMetaKey.Selector], ...bnbBeaconNetworkTimestamp }}
		<EntityView
			entityType={EntityType.BnbBeaconNetwork_Timestamp}
			entitySelector={bnbBeaconNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bnbBeaconNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'bnb beacon network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bnbBeaconNetworkTimestampFields.latestArchivedHeight) ?? ''), String((bnbBeaconNetworkTimestampFields.archiveCoverageStatus) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bnbBeaconNetworkTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
