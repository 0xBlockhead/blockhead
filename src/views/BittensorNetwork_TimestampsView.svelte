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
		title = 'Bittensor network observations',
		typeAnnotationParagraphs = ['A point-in-time runtime and subsystem observation for a Bittensor network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BittensorNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BittensorNetwork_Timestamp>
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
	entityType={EntityType.BittensorNetwork_Timestamp}
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
				finalizedBlockNumber: true,
				runtimeSpecName: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bittensorNetworkTimestamps) => [...new Map(bittensorNetworkTimestamps.values.map((bittensorNetworkTimestamp) => [bittensorNetworkTimestamp[EntityMetaKey.SelectorKey], bittensorNetworkTimestamp])).values()]}
	getKey={(bittensorNetworkTimestamp) => bittensorNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bittensor network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bittensorNetworkTimestamp })}
		{@const bittensorNetworkTimestampFields = { ...bittensorNetworkTimestamp[EntityMetaKey.Selector], ...bittensorNetworkTimestamp }}
		<EntityView
			entityType={EntityType.BittensorNetwork_Timestamp}
			entitySelector={bittensorNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bittensorNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Bittensor network observation'}
			{/snippet}

			{#snippet Value()}
				{[String((bittensorNetworkTimestampFields.finalizedBlockNumber) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bittensorNetworkTimestampFields.runtimeSpecName) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
