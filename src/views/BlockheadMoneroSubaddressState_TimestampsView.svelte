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
		title = 'Blockhead Monero subaddress state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroSubaddressState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadMoneroSubaddressState_Timestamp>
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
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
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
				balanceAtomicUnits: true,
				used: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadMoneroSubaddressStateTimestamps) => [...new Map(blockheadMoneroSubaddressStateTimestamps.values.map((blockheadMoneroSubaddressStateTimestamp) => [blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroSubaddressStateTimestamp])).values()]}
	getKey={(blockheadMoneroSubaddressStateTimestamp) => blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero subaddress state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroSubaddressStateTimestamp })}
		{@const blockheadMoneroSubaddressStateTimestampFields = { ...blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroSubaddressStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
			entitySelector={blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadMoneroSubaddressStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadMoneroSubaddressStateTimestampFields.balanceAtomicUnits) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadMoneroSubaddressStateTimestampFields.used) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
