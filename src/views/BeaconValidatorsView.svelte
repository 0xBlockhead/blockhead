<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconValidator>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
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
		{@const selection = select(EntityType.BeaconValidator, beaconValidator[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const beaconValidatorHrefFields = { ...beaconValidator, ...beaconValidator[EntityMetaKey.Selector] }}
		<BeaconValidatorView
			selection={selection}
			prefetched={beaconValidatorFields}
			href={
				(beaconValidatorHrefFields.indexInNetwork !== undefined && beaconValidatorHrefFields.$network !== undefined && beaconValidatorHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
					validatorId: String(beaconValidatorHrefFields.indexInNetwork ?? ''),
					network: String(caip2StringFromValue(beaconValidatorHrefFields.$network.caip2) ?? ''),
				}) : beaconValidatorHrefFields.indexInNetwork !== undefined && beaconValidatorHrefFields.$network !== undefined && beaconValidatorHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
					validatorId: String(beaconValidatorHrefFields.indexInNetwork ?? ''),
					network: String(beaconValidatorHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
