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
		title = 'Blockhead Fedimint client state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFedimintClientState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadFedimintClientState_Timestamp>
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
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
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
				balanceMsat: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadFedimintClientStateTimestamps) => [...new Map(blockheadFedimintClientStateTimestamps.values.map((blockheadFedimintClientStateTimestamp) => [blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey], blockheadFedimintClientStateTimestamp])).values()]}
	getKey={(blockheadFedimintClientStateTimestamp) => blockheadFedimintClientStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Fedimint client state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFedimintClientStateTimestamp })}
		{@const blockheadFedimintClientStateTimestampFields = { ...blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector], ...blockheadFedimintClientStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadFedimintClientState_Timestamp}
			entitySelector={blockheadFedimintClientStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadFedimintClientStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadFedimintClientStateTimestampFields.balanceMsat) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadFedimintClientStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
