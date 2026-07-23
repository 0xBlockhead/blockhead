<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM topic observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTopic_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmTopic_Timestamp>
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
	entityType={EntityType.EvmTopic_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
			],
			fields: {
				timestampMs: true,
				source: true,
				$topic: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmTopicTimestamps) => [...new Map(evmTopicTimestamps.values.map((evmTopicTimestamp) => [evmTopicTimestamp[EntityMetaKey.SelectorKey], evmTopicTimestamp])).values()]}
	getKey={(evmTopicTimestamp) => evmTopicTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM topic observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmTopicTimestamp })}
		{@const evmTopicTimestampFields = { ...evmTopicTimestamp[EntityMetaKey.Selector], ...evmTopicTimestamp }}
		<EntityView
			entityType={EntityType.EvmTopic_Timestamp}
			entitySelector={evmTopicTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmTopicTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmTopicTimestamp[EntityMetaKey.Selector]
					&& evmTopicTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmTopicTimestamp[EntityMetaKey.Selector] != null && 'source' in evmTopicTimestamp[EntityMetaKey.Selector]
					&& evmTopicTimestamp[EntityMetaKey.Selector].source != null
					&& evmTopicTimestamp[EntityMetaKey.Selector] != null && '$topic' in evmTopicTimestamp[EntityMetaKey.Selector]
					&& evmTopicTimestamp[EntityMetaKey.Selector].$topic != null && 'hex' in evmTopicTimestamp[EntityMetaKey.Selector].$topic
					&& evmTopicTimestamp[EntityMetaKey.Selector].$topic.hex != null ?
						resolve('/evm/topic/[hex=evmTopicHash]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmTopicTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(evmTopicTimestamp[EntityMetaKey.Selector].source ?? ''),
					hex: String(evmTopicTimestamp[EntityMetaKey.Selector].$topic.hex ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'EVM topic observation'}
			{/snippet}

			{#snippet Value()}
				{[String((evmTopicTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmTopicTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
