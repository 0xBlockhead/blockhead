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
		title = 'Blockhead Kaspa node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadKaspaNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadKaspaNodeState_Timestamp>
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
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
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
				isSynced: true,
				hasUtxoIndex: true,
				peerCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadKaspaNodeStateTimestamps) => [...new Map(blockheadKaspaNodeStateTimestamps.values.map((blockheadKaspaNodeStateTimestamp) => [blockheadKaspaNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadKaspaNodeStateTimestamp])).values()]}
	getKey={(blockheadKaspaNodeStateTimestamp) => blockheadKaspaNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead kaspa node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadKaspaNodeStateTimestamp })}
		{@const blockheadKaspaNodeStateTimestampFields = { ...blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadKaspaNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
			entitySelector={blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadKaspaNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead kaspa node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadKaspaNodeStateTimestampFields.isSynced) ?? ''), String((blockheadKaspaNodeStateTimestampFields.hasUtxoIndex) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadKaspaNodeStateTimestampFields.peerCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
