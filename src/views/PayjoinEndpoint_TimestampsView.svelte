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
		title = 'Payjoin endpoint observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PayjoinEndpoint_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PayjoinEndpoint_Timestamp>
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
	entityType={EntityType.PayjoinEndpoint_Timestamp}
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
				responseStatus: true,
				error: true,
				requiresOhttp: true,
				supportsOutputSubstitution: true,
			},
		})
	}
	{countResource}
	getResourceItems={(payjoinEndpointTimestamps) => [...new Map(payjoinEndpointTimestamps.values.map((payjoinEndpointTimestamp) => [payjoinEndpointTimestamp[EntityMetaKey.SelectorKey], payjoinEndpointTimestamp])).values()]}
	getKey={(payjoinEndpointTimestamp) => payjoinEndpointTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Payjoin endpoint observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: payjoinEndpointTimestamp })}
		{@const payjoinEndpointTimestampFields = { ...payjoinEndpointTimestamp[EntityMetaKey.Selector], ...payjoinEndpointTimestamp }}
		<EntityView
			entityType={EntityType.PayjoinEndpoint_Timestamp}
			entitySelector={payjoinEndpointTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((payjoinEndpointTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'payjoin endpoint timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((payjoinEndpointTimestampFields.responseStatus) ?? ''), String((payjoinEndpointTimestampFields.error) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((payjoinEndpointTimestampFields.requiresOhttp) ?? ''), String((payjoinEndpointTimestampFields.supportsOutputSubstitution) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
