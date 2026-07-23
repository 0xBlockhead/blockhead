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
		title = 'Blockhead Zcash viewing key observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashViewingKey_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZcashViewingKey_Timestamp>
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
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
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
				lastScannedHeight: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadZcashViewingKeyTimestamps) => [...new Map(blockheadZcashViewingKeyTimestamps.values.map((blockheadZcashViewingKeyTimestamp) => [blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey], blockheadZcashViewingKeyTimestamp])).values()]}
	getKey={(blockheadZcashViewingKeyTimestamp) => blockheadZcashViewingKeyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash viewing key observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashViewingKeyTimestamp })}
		{@const blockheadZcashViewingKeyTimestampFields = { ...blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector], ...blockheadZcashViewingKeyTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
			entitySelector={blockheadZcashViewingKeyTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZcashViewingKeyTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash viewing key timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadZcashViewingKeyTimestampFields.lastScannedHeight) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadZcashViewingKeyTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
