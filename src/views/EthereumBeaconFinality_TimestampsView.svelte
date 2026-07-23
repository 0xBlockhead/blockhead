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
		title = 'Finality',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumBeaconFinality_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EthereumBeaconFinality_Timestamp>
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
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
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
				finalizedCheckpointEpoch: true,
				timestampMs: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ethereumBeaconFinalityTimestamps) => [...new Map(ethereumBeaconFinalityTimestamps.values.map((ethereumBeaconFinalityTimestamp) => [ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey], ethereumBeaconFinalityTimestamp])).values()]}
	getKey={(ethereumBeaconFinalityTimestamp) => ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Ethereum beacon finality observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ethereumBeaconFinalityTimestamp })}
		{@const ethereumBeaconFinalityTimestampFields = { ...ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector], ...ethereumBeaconFinalityTimestamp }}
		<EntityView
			entityType={EntityType.EthereumBeaconFinality_Timestamp}
			entitySelector={ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector]}
			href={
				(
					ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector]
					&& ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector] != null && '$network' in ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector] ?
						ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network != null && 'caip2' in ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network
						&& ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
						timestampMs: String(ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						network: String(caip2StringFromValue(ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network != null && 'slug' in ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network
							&& ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
							timestampMs: String(ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							network: String(ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[(String((ethereumBeaconFinalityTimestampFields.finalizedCheckpointEpoch) ?? '') ? 'Finalized epoch ' + String((ethereumBeaconFinalityTimestampFields.finalizedCheckpointEpoch) ?? '') : '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((ethereumBeaconFinalityTimestampFields.finalizedCheckpointEpoch) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((ethereumBeaconFinalityTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
