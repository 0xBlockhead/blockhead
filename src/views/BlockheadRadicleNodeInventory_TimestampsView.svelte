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
		title = 'Blockhead Radicle node inventory observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleNodeInventory_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadRadicleNodeInventory_Timestamp>
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
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
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
				status: true,
				timestampMs: true,
				repositoryCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadRadicleNodeInventoryTimestamps) => [...new Map(blockheadRadicleNodeInventoryTimestamps.values.map((blockheadRadicleNodeInventoryTimestamp) => [blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleNodeInventoryTimestamp])).values()]}
	getKey={(blockheadRadicleNodeInventoryTimestamp) => blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle node inventory observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleNodeInventoryTimestamp })}
		{@const blockheadRadicleNodeInventoryTimestampFields = { ...blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector], ...blockheadRadicleNodeInventoryTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
			entitySelector={blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadRadicleNodeInventoryTimestampFields.status) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle node inventory timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadRadicleNodeInventoryTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadRadicleNodeInventoryTimestampFields.repositoryCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
