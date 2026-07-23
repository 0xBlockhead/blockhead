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
		title = 'Blockhead Litecoin MWEB output state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLitecoinMwebOutputState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLitecoinMwebOutputState_Timestamp>
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
	entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
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
	getResourceItems={(blockheadLitecoinMwebOutputStateTimestamps) => [...new Map(blockheadLitecoinMwebOutputStateTimestamps.values.map((blockheadLitecoinMwebOutputStateTimestamp) => [blockheadLitecoinMwebOutputStateTimestamp[EntityMetaKey.SelectorKey], blockheadLitecoinMwebOutputStateTimestamp])).values()]}
	getKey={(blockheadLitecoinMwebOutputStateTimestamp) => blockheadLitecoinMwebOutputStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead litecoin mweb output state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLitecoinMwebOutputStateTimestamp })}
		{@const blockheadLitecoinMwebOutputStateTimestampFields = { ...blockheadLitecoinMwebOutputStateTimestamp[EntityMetaKey.Selector], ...blockheadLitecoinMwebOutputStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
			entitySelector={blockheadLitecoinMwebOutputStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLitecoinMwebOutputStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead litecoin mweb output state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLitecoinMwebOutputStateTimestampFields.spent) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLitecoinMwebOutputStateTimestampFields.confirmations) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
