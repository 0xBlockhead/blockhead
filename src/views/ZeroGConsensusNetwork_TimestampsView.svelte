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
		title = 'Zero g consensus network observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZeroGConsensusNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ZeroGConsensusNetwork_Timestamp>
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
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
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
				$consensusNetwork: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(zeroGConsensusNetworkTimestamps) => [...new Map(zeroGConsensusNetworkTimestamps.values.map((zeroGConsensusNetworkTimestamp) => [zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey], zeroGConsensusNetworkTimestamp])).values()]}
	getKey={(zeroGConsensusNetworkTimestamp) => zeroGConsensusNetworkTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zero g consensus network observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zeroGConsensusNetworkTimestamp })}
		{@const zeroGConsensusNetworkTimestampFields = { ...zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector], ...zeroGConsensusNetworkTimestamp }}
		<EntityView
			entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
			entitySelector={zeroGConsensusNetworkTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((zeroGConsensusNetworkTimestampFields.$consensusNetwork.consensusNetworkId) ?? '')].filter(Boolean).join(' ') || 'zero g consensus network'].filter(Boolean).join(' ') || 'zero g consensus network timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((zeroGConsensusNetworkTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
