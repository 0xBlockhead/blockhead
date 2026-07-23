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
		title = 'EVM error observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmError_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmError_Timestamp>
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
	entityType={EntityType.EvmError_Timestamp}
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
				$error: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmErrorTimestamps) => [...new Map(evmErrorTimestamps.values.map((evmErrorTimestamp) => [evmErrorTimestamp[EntityMetaKey.SelectorKey], evmErrorTimestamp])).values()]}
	getKey={(evmErrorTimestamp) => evmErrorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM error observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmErrorTimestamp })}
		{@const evmErrorTimestampFields = { ...evmErrorTimestamp[EntityMetaKey.Selector], ...evmErrorTimestamp }}
		<EntityView
			entityType={EntityType.EvmError_Timestamp}
			entitySelector={evmErrorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmErrorTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmErrorTimestamp[EntityMetaKey.Selector]
					&& evmErrorTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmErrorTimestamp[EntityMetaKey.Selector] != null && 'source' in evmErrorTimestamp[EntityMetaKey.Selector]
					&& evmErrorTimestamp[EntityMetaKey.Selector].source != null
					&& evmErrorTimestamp[EntityMetaKey.Selector] != null && '$error' in evmErrorTimestamp[EntityMetaKey.Selector]
					&& evmErrorTimestamp[EntityMetaKey.Selector].$error != null && 'hex' in evmErrorTimestamp[EntityMetaKey.Selector].$error
					&& evmErrorTimestamp[EntityMetaKey.Selector].$error.hex != null ?
						resolve('/evm/error/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(evmErrorTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(evmErrorTimestamp[EntityMetaKey.Selector].source ?? ''),
					hex: String(evmErrorTimestamp[EntityMetaKey.Selector].$error.hex ?? ''),
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
				{'EVM error observation'}
			{/snippet}

			{#snippet Value()}
				{[String((evmErrorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmErrorTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
