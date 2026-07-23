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
		title = 'Blockhead Lightning channel state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningChannelState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningChannelState_Timestamp>
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
	entityType={EntityType.BlockheadLightningChannelState_Timestamp}
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
				active: true,
				localBalanceSats: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningChannelStateTimestamps) => [...new Map(blockheadLightningChannelStateTimestamps.values.map((blockheadLightningChannelStateTimestamp) => [blockheadLightningChannelStateTimestamp[EntityMetaKey.SelectorKey], blockheadLightningChannelStateTimestamp])).values()]}
	getKey={(blockheadLightningChannelStateTimestamp) => blockheadLightningChannelStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning channel state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningChannelStateTimestamp })}
		{@const blockheadLightningChannelStateTimestampFields = { ...blockheadLightningChannelStateTimestamp[EntityMetaKey.Selector], ...blockheadLightningChannelStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState_Timestamp}
			entitySelector={blockheadLightningChannelStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLightningChannelStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning channel state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningChannelStateTimestampFields.active) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLightningChannelStateTimestampFields.localBalanceSats) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
