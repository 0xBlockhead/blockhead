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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoCommittee_Epoch>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.CardanoCommittee_Epoch}
			entitySelector={cardanoCommitteeEpoch[EntityMetaKey.Selector]}
			href={
				(
					cardanoCommitteeEpoch[EntityMetaKey.Selector] != null && 'epoch' in cardanoCommitteeEpoch[EntityMetaKey.Selector]
					&& cardanoCommitteeEpoch[EntityMetaKey.Selector].epoch != null
					&& cardanoCommitteeEpoch[EntityMetaKey.Selector] != null && 'source' in cardanoCommitteeEpoch[EntityMetaKey.Selector]
					&& cardanoCommitteeEpoch[EntityMetaKey.Selector].source != null
					&& cardanoCommitteeEpoch[EntityMetaKey.Selector] != null && '$network' in cardanoCommitteeEpoch[EntityMetaKey.Selector] ?
						cardanoCommitteeEpoch[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoCommitteeEpoch[EntityMetaKey.Selector].$network
						&& cardanoCommitteeEpoch[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
						epoch: String(cardanoCommitteeEpoch[EntityMetaKey.Selector].epoch ?? ''),
						source: String(cardanoCommitteeEpoch[EntityMetaKey.Selector].source ?? ''),
						network: String(caip2StringFromValue(cardanoCommitteeEpoch[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoCommitteeEpoch[EntityMetaKey.Selector].$network != null && 'slug' in cardanoCommitteeEpoch[EntityMetaKey.Selector].$network
							&& cardanoCommitteeEpoch[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', {
							epoch: String(cardanoCommitteeEpoch[EntityMetaKey.Selector].epoch ?? ''),
							source: String(cardanoCommitteeEpoch[EntityMetaKey.Selector].source ?? ''),
							network: String(cardanoCommitteeEpoch[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[(String((cardanoCommitteeEpochFields.epoch) ?? '') ? 'Epoch ' + String((cardanoCommitteeEpochFields.epoch) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano committee epoch'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoCommitteeEpochFields.memberCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
