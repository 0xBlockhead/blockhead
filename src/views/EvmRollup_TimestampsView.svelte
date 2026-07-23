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
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM rollup observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmRollup_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmRollup_Timestamp>
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
	entityType={EntityType.EvmRollup_Timestamp}
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
				listingStage: true,
				timestampMs: true,
				$rollup: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmRollupTimestamps) => [...new Map(evmRollupTimestamps.values.map((evmRollupTimestamp) => [evmRollupTimestamp[EntityMetaKey.SelectorKey], evmRollupTimestamp])).values()]}
	getKey={(evmRollupTimestamp) => evmRollupTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM rollup observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmRollupTimestamp })}
		{@const evmRollupTimestampFields = { ...evmRollupTimestamp[EntityMetaKey.Selector], ...evmRollupTimestamp }}
		<EntityView
			entityType={EntityType.EvmRollup_Timestamp}
			entitySelector={evmRollupTimestamp[EntityMetaKey.Selector]}
			href={
				(
					evmRollupTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in evmRollupTimestamp[EntityMetaKey.Selector]
					&& evmRollupTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& evmRollupTimestamp[EntityMetaKey.Selector] != null && 'source' in evmRollupTimestamp[EntityMetaKey.Selector]
					&& evmRollupTimestamp[EntityMetaKey.Selector].source != null
					&& evmRollupTimestamp[EntityMetaKey.Selector] != null && '$rollup' in evmRollupTimestamp[EntityMetaKey.Selector]
					&& evmRollupTimestamp[EntityMetaKey.Selector].$rollup != null && 'projectId' in evmRollupTimestamp[EntityMetaKey.Selector].$rollup
					&& evmRollupTimestamp[EntityMetaKey.Selector].$rollup.projectId != null
					&& evmRollupTimestamp[EntityMetaKey.Selector].$rollup != null && '$network' in evmRollupTimestamp[EntityMetaKey.Selector].$rollup ?
						evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network != null && 'caip2' in evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network
						&& evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(evmRollupTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(evmRollupTimestamp[EntityMetaKey.Selector].source ?? ''),
						projectId: String(evmRollupTimestamp[EntityMetaKey.Selector].$rollup.projectId ?? ''),
						network: String(caip2StringFromValue(evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network.caip2) ?? ''),
					})
					:
							evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network != null && 'slug' in evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network
							&& evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(evmRollupTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(evmRollupTimestamp[EntityMetaKey.Selector].source ?? ''),
							projectId: String(evmRollupTimestamp[EntityMetaKey.Selector].$rollup.projectId ?? ''),
							network: String(evmRollupTimestamp[EntityMetaKey.Selector].$rollup.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmRollupTimestampFields.listingStage) ?? ''), String((evmRollupTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'EVM rollup timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((evmRollupTimestampFields.listingStage) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmRollupTimestampFields.$rollup.name) ?? ''), String((evmRollupTimestampFields.$rollup.projectId) ?? '')].filter(Boolean).join(' ') || 'EVM rollup'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
