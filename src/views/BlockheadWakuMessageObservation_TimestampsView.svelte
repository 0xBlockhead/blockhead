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
		title = 'Blockhead Waku message observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWakuMessageObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWakuMessageObservation_Timestamp>
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
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
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
				messageHash: true,
				timestampMs: true,
				contentTopic: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWakuMessageObservationTimestamps) => [...new Map(blockheadWakuMessageObservationTimestamps.values.map((blockheadWakuMessageObservationTimestamp) => [blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey], blockheadWakuMessageObservationTimestamp])).values()]}
	getKey={(blockheadWakuMessageObservationTimestamp) => blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead waku message observation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWakuMessageObservationTimestamp })}
		{@const blockheadWakuMessageObservationTimestampFields = { ...blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector], ...blockheadWakuMessageObservationTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
			entitySelector={blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadWakuMessageObservationTimestampFields.messageHash) ?? '')].filter(Boolean).join(' ') || 'blockhead waku message observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWakuMessageObservationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadWakuMessageObservationTimestampFields.contentTopic) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
