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
		title = 'Blockhead Monero transfer state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroTransferState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadMoneroTransferState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
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
				spent: true,
				confirmations: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadMoneroTransferStateTimestamps) => [...new Map(blockheadMoneroTransferStateTimestamps.values.map((blockheadMoneroTransferStateTimestamp) => [blockheadMoneroTransferStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroTransferStateTimestamp])).values()]}
	getKey={(blockheadMoneroTransferStateTimestamp) => blockheadMoneroTransferStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero transfer state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroTransferStateTimestamp })}
		{@const blockheadMoneroTransferStateTimestampFields = { ...blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroTransferStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
			entitySelector={blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadMoneroTransferStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero transfer state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadMoneroTransferStateTimestampFields.spent) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadMoneroTransferStateTimestampFields.confirmations) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
