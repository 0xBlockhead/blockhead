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
		title = 'Epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconEpochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconEpoch>
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
	entityType={EntityType.BeaconEpoch}
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
				epoch: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(beaconEpochs) => [...new Map(beaconEpochs.values.map((beaconEpoch) => [beaconEpoch[EntityMetaKey.SelectorKey], beaconEpoch])).values()]}
	getKey={(beaconEpoch) => beaconEpoch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon epochs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconEpoch })}
		{@const beaconEpochFields = { ...beaconEpoch[EntityMetaKey.Selector], ...beaconEpoch }}
		<EntityView
			entityType={EntityType.BeaconEpoch}
			entitySelector={beaconEpoch[EntityMetaKey.Selector]}
			href={
				(
					beaconEpoch[EntityMetaKey.Selector] != null && 'epoch' in beaconEpoch[EntityMetaKey.Selector]
					&& beaconEpoch[EntityMetaKey.Selector].epoch != null
					&& beaconEpoch[EntityMetaKey.Selector] != null && '$network' in beaconEpoch[EntityMetaKey.Selector] ?
						beaconEpoch[EntityMetaKey.Selector].$network != null && 'caip2' in beaconEpoch[EntityMetaKey.Selector].$network
						&& beaconEpoch[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
						epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
						network: String(caip2StringFromValue(beaconEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconEpoch[EntityMetaKey.Selector].$network != null && 'slug' in beaconEpoch[EntityMetaKey.Selector].$network
							&& beaconEpoch[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
							epoch: String(beaconEpoch[EntityMetaKey.Selector].epoch ?? ''),
							network: String(beaconEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconEpochFields.epoch) ?? '') ? 'Epoch #' + String((beaconEpochFields.epoch) ?? '') : '') || 'beacon epoch'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
