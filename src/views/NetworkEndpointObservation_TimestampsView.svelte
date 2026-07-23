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
		title = 'Network endpoint observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NetworkEndpointObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NetworkEndpointObservation_Timestamp>
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
	entityType={EntityType.NetworkEndpointObservation_Timestamp}
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
				health: true,
				latencyMs: true,
				endpointKind: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(networkEndpointObservationTimestamps) => [...new Map(networkEndpointObservationTimestamps.values.map((networkEndpointObservationTimestamp) => [networkEndpointObservationTimestamp[EntityMetaKey.SelectorKey], networkEndpointObservationTimestamp])).values()]}
	getKey={(networkEndpointObservationTimestamp) => networkEndpointObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network endpoint observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkEndpointObservationTimestamp })}
		{@const networkEndpointObservationTimestampFields = { ...networkEndpointObservationTimestamp[EntityMetaKey.Selector], ...networkEndpointObservationTimestamp }}
		<EntityView
			entityType={EntityType.NetworkEndpointObservation_Timestamp}
			entitySelector={networkEndpointObservationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkEndpointObservationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'network endpoint observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((networkEndpointObservationTimestampFields.health) ?? ''), String((networkEndpointObservationTimestampFields.latencyMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((networkEndpointObservationTimestampFields.endpointKind) ?? ''), String((networkEndpointObservationTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
