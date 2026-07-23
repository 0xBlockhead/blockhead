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
		title = 'EVM selector observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmSelector_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmSelector_Timestamp>
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
	entityType={EntityType.EvmSelector_Timestamp}
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
				$selector: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmSelectorTimestamps) => [...new Map(evmSelectorTimestamps.values.map((evmSelectorTimestamp) => [evmSelectorTimestamp[EntityMetaKey.SelectorKey], evmSelectorTimestamp])).values()]}
	getKey={(evmSelectorTimestamp) => evmSelectorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM selector observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmSelectorTimestamp })}
		{@const evmSelectorTimestampFields = { ...evmSelectorTimestamp[EntityMetaKey.Selector], ...evmSelectorTimestamp }}
		<EntityView
			entityType={EntityType.EvmSelector_Timestamp}
			entitySelector={evmSelectorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmSelectorTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmSelectorTimestamp[EntityMetaKey.Selector]
					&& evmSelectorTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmSelectorTimestamp[EntityMetaKey.Selector] != null && 'source' in evmSelectorTimestamp[EntityMetaKey.Selector]
					&& evmSelectorTimestamp[EntityMetaKey.Selector].source != null
					&& evmSelectorTimestamp[EntityMetaKey.Selector] != null && '$selector' in evmSelectorTimestamp[EntityMetaKey.Selector]
					&& evmSelectorTimestamp[EntityMetaKey.Selector].$selector != null && 'hex' in evmSelectorTimestamp[EntityMetaKey.Selector].$selector
					&& evmSelectorTimestamp[EntityMetaKey.Selector].$selector.hex != null ?
						resolve('/evm/selector/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmSelectorTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(evmSelectorTimestamp[EntityMetaKey.Selector].source ?? ''),
					hex: String(evmSelectorTimestamp[EntityMetaKey.Selector].$selector.hex ?? ''),
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
				{'EVM selector observation'}
			{/snippet}

			{#snippet Value()}
				{[String((evmSelectorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmSelectorTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
