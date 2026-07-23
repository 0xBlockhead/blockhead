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
		title = 'Filecoin miner observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMiner_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinMiner_Timestamp>
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
	entityType={EntityType.FilecoinMiner_Timestamp}
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
				qualityAdjustedPower: true,
				height: true,
				tipsetKey: true,
				source: true,
				$miner: true,
			},
		})
	}
	{countResource}
	getResourceItems={(filecoinMinerTimestamps) => [...new Map(filecoinMinerTimestamps.values.map((filecoinMinerTimestamp) => [filecoinMinerTimestamp[EntityMetaKey.SelectorKey], filecoinMinerTimestamp])).values()]}
	getKey={(filecoinMinerTimestamp) => filecoinMinerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin miner observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinMinerTimestamp })}
		{@const filecoinMinerTimestampFields = { ...filecoinMinerTimestamp[EntityMetaKey.Selector], ...filecoinMinerTimestamp }}
		<EntityView
			entityType={EntityType.FilecoinMiner_Timestamp}
			entitySelector={filecoinMinerTimestamp[EntityMetaKey.Selector]}
			href={
				(
					filecoinMinerTimestamp[EntityMetaKey.Selector] != null && 'height' in filecoinMinerTimestamp[EntityMetaKey.Selector]
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].height != null
					&& filecoinMinerTimestamp[EntityMetaKey.Selector] != null && 'tipsetKey' in filecoinMinerTimestamp[EntityMetaKey.Selector]
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey != null
					&& filecoinMinerTimestamp[EntityMetaKey.Selector] != null && 'source' in filecoinMinerTimestamp[EntityMetaKey.Selector]
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].source != null
					&& filecoinMinerTimestamp[EntityMetaKey.Selector] != null && '$miner' in filecoinMinerTimestamp[EntityMetaKey.Selector]
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].$miner != null && 'minerAddress' in filecoinMinerTimestamp[EntityMetaKey.Selector].$miner
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress != null
					&& filecoinMinerTimestamp[EntityMetaKey.Selector].$miner != null && '$network' in filecoinMinerTimestamp[EntityMetaKey.Selector].$miner ?
						filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network != null && 'caip2' in filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network
						&& filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
						height: String(filecoinMinerTimestamp[EntityMetaKey.Selector].height ?? ''),
						tipsetKey: String(filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
						source: String(filecoinMinerTimestamp[EntityMetaKey.Selector].source ?? ''),
						minerAddress: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress ?? ''),
						network: String(caip2StringFromValue(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.caip2) ?? ''),
					})
					:
							filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network != null && 'slug' in filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network
							&& filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
							height: String(filecoinMinerTimestamp[EntityMetaKey.Selector].height ?? ''),
							tipsetKey: String(filecoinMinerTimestamp[EntityMetaKey.Selector].tipsetKey ?? ''),
							source: String(filecoinMinerTimestamp[EntityMetaKey.Selector].source ?? ''),
							minerAddress: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.minerAddress ?? ''),
							network: String(filecoinMinerTimestamp[EntityMetaKey.Selector].$miner.$network.slug ?? ''),
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
				{[String((filecoinMinerTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin miner timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((filecoinMinerTimestampFields.qualityAdjustedPower) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((filecoinMinerTimestampFields.height) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
