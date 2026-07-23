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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconValidator>
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
	entityType={EntityType.BeaconValidator}
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
				indexInNetwork: true,
				status: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(beaconValidators) => [...new Map(beaconValidators.values.map((beaconValidator) => [beaconValidator[EntityMetaKey.SelectorKey], beaconValidator])).values()]}
	getKey={(beaconValidator) => beaconValidator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon validators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconValidator })}
		{@const beaconValidatorFields = { ...beaconValidator[EntityMetaKey.Selector], ...beaconValidator }}
		<EntityView
			entityType={EntityType.BeaconValidator}
			entitySelector={beaconValidator[EntityMetaKey.Selector]}
			href={
				(
					beaconValidator[EntityMetaKey.Selector] != null && 'indexInNetwork' in beaconValidator[EntityMetaKey.Selector]
					&& beaconValidator[EntityMetaKey.Selector].indexInNetwork != null
					&& beaconValidator[EntityMetaKey.Selector] != null && '$network' in beaconValidator[EntityMetaKey.Selector] ?
						beaconValidator[EntityMetaKey.Selector].$network != null && 'caip2' in beaconValidator[EntityMetaKey.Selector].$network
						&& beaconValidator[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
						validatorId: String(beaconValidator[EntityMetaKey.Selector].indexInNetwork ?? ''),
						network: String(caip2StringFromValue(beaconValidator[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconValidator[EntityMetaKey.Selector].$network != null && 'slug' in beaconValidator[EntityMetaKey.Selector].$network
							&& beaconValidator[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
							validatorId: String(beaconValidator[EntityMetaKey.Selector].indexInNetwork ?? ''),
							network: String(beaconValidator[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconValidatorFields.indexInNetwork) ?? '') ? 'Validator #' + String((beaconValidatorFields.indexInNetwork) ?? '') : '') || 'beacon validator'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((beaconValidatorFields.status) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
