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
		title = 'Beacon validator observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconValidator_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconValidator_Timestamp>
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
	entityType={EntityType.BeaconValidator_Timestamp}
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
				slot: true,
				status: true,
				source: true,
				$validator: true,
			},
		})
	}
	{countResource}
	getResourceItems={(beaconValidatorTimestamps) => [...new Map(beaconValidatorTimestamps.values.map((beaconValidatorTimestamp) => [beaconValidatorTimestamp[EntityMetaKey.SelectorKey], beaconValidatorTimestamp])).values()]}
	getKey={(beaconValidatorTimestamp) => beaconValidatorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon validator observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconValidatorTimestamp })}
		{@const beaconValidatorTimestampFields = { ...beaconValidatorTimestamp[EntityMetaKey.Selector], ...beaconValidatorTimestamp }}
		<EntityView
			entityType={EntityType.BeaconValidator_Timestamp}
			entitySelector={beaconValidatorTimestamp[EntityMetaKey.Selector]}
			href={
				(
					beaconValidatorTimestamp[EntityMetaKey.Selector] != null && 'slot' in beaconValidatorTimestamp[EntityMetaKey.Selector]
					&& beaconValidatorTimestamp[EntityMetaKey.Selector].slot != null
					&& beaconValidatorTimestamp[EntityMetaKey.Selector] != null && 'source' in beaconValidatorTimestamp[EntityMetaKey.Selector]
					&& beaconValidatorTimestamp[EntityMetaKey.Selector].source != null
					&& beaconValidatorTimestamp[EntityMetaKey.Selector] != null && '$validator' in beaconValidatorTimestamp[EntityMetaKey.Selector]
					&& beaconValidatorTimestamp[EntityMetaKey.Selector].$validator != null && 'indexInNetwork' in beaconValidatorTimestamp[EntityMetaKey.Selector].$validator
					&& beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.indexInNetwork != null
					&& beaconValidatorTimestamp[EntityMetaKey.Selector].$validator != null && '$network' in beaconValidatorTimestamp[EntityMetaKey.Selector].$validator ?
						beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network != null && 'caip2' in beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network
						&& beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/observations/[slot=nonNegativeInteger]/[source=stringSegment]', {
						slot: String(beaconValidatorTimestamp[EntityMetaKey.Selector].slot ?? ''),
						source: String(beaconValidatorTimestamp[EntityMetaKey.Selector].source ?? ''),
						validatorId: String(beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.indexInNetwork ?? ''),
						network: String(caip2StringFromValue(beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network.caip2) ?? ''),
					})
					:
							beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network != null && 'slug' in beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network
							&& beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/observations/[slot=nonNegativeInteger]/[source=stringSegment]', {
							slot: String(beaconValidatorTimestamp[EntityMetaKey.Selector].slot ?? ''),
							source: String(beaconValidatorTimestamp[EntityMetaKey.Selector].source ?? ''),
							validatorId: String(beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.indexInNetwork ?? ''),
							network: String(beaconValidatorTimestamp[EntityMetaKey.Selector].$validator.$network.slug ?? ''),
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
				{(String((beaconValidatorTimestampFields.slot) ?? '') ? 'Slot #' + String((beaconValidatorTimestampFields.slot) ?? '') : '') || 'beacon validator timestamp'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((beaconValidatorTimestampFields.status) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
