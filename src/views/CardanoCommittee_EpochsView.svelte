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
		title = 'Cardano committee epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoCommittee_Epochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoCommittee_Epoch>
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
	import CardanoCommittee_EpochView from '$/views/CardanoCommittee_EpochView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoCommittee_Epoch}
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
				memberCount: true,
				source: true,
				$network: true,
			},
		})
	}
	getResourceItems={(cardanoCommitteeEpochs) => [...new Map(cardanoCommitteeEpochs.values.map((cardanoCommitteeEpoch) => [cardanoCommitteeEpoch[EntityMetaKey.SelectorKey], cardanoCommitteeEpoch])).values()]}
	getKey={(cardanoCommitteeEpoch) => cardanoCommitteeEpoch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano committee epochs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoCommitteeEpoch })}
		{@const cardanoCommitteeEpochFields = { ...cardanoCommitteeEpoch[EntityMetaKey.Selector], ...cardanoCommitteeEpoch }}
		{@const selection = select(EntityType.CardanoCommittee_Epoch, cardanoCommitteeEpoch[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const cardanoCommitteeEpochHrefFields = { ...cardanoCommitteeEpoch, ...cardanoCommitteeEpoch[EntityMetaKey.Selector] }}
		<CardanoCommittee_EpochView
			selection={selection}
			prefetched={cardanoCommitteeEpochFields}
			href={
				(cardanoCommitteeEpochHrefFields.epoch !== undefined && cardanoCommitteeEpochHrefFields.source !== undefined && cardanoCommitteeEpochHrefFields.$network !== undefined && cardanoCommitteeEpochHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
					epoch: String(cardanoCommitteeEpochHrefFields.epoch ?? ''),
					source: String(cardanoCommitteeEpochHrefFields.source ?? ''),
					network: String(caip2StringFromValue(cardanoCommitteeEpochHrefFields.$network.caip2) ?? ''),
				}) : cardanoCommitteeEpochHrefFields.epoch !== undefined && cardanoCommitteeEpochHrefFields.source !== undefined && cardanoCommitteeEpochHrefFields.$network !== undefined && cardanoCommitteeEpochHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
					epoch: String(cardanoCommitteeEpochHrefFields.epoch ?? ''),
					source: String(cardanoCommitteeEpochHrefFields.source ?? ''),
					network: String(cardanoCommitteeEpochHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
