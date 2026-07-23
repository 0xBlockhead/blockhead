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
		title = 'Cardano DReps',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoDReps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoDRep>
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
	entityType={EntityType.CardanoDRep}
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
				displayName: true,
				drepCredential: true,
				credentialKind: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoDReps) => [...new Map(cardanoDReps.values.map((cardanoDRep) => [cardanoDRep[EntityMetaKey.SelectorKey], cardanoDRep])).values()]}
	getKey={(cardanoDRep) => cardanoDRep[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano DReps yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoDRep })}
		{@const cardanoDRepFields = { ...cardanoDRep[EntityMetaKey.Selector], ...cardanoDRep }}
		<EntityView
			entityType={EntityType.CardanoDRep}
			entitySelector={cardanoDRep[EntityMetaKey.Selector]}
			href={
				(
					cardanoDRep[EntityMetaKey.Selector] != null && 'drepCredential' in cardanoDRep[EntityMetaKey.Selector]
					&& cardanoDRep[EntityMetaKey.Selector].drepCredential != null
					&& cardanoDRep[EntityMetaKey.Selector] != null && '$network' in cardanoDRep[EntityMetaKey.Selector] ?
						cardanoDRep[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoDRep[EntityMetaKey.Selector].$network
						&& cardanoDRep[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
						drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
						network: String(caip2StringFromValue(cardanoDRep[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoDRep[EntityMetaKey.Selector].$network != null && 'slug' in cardanoDRep[EntityMetaKey.Selector].$network
							&& cardanoDRep[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
							drepCredential: String(cardanoDRep[EntityMetaKey.Selector].drepCredential ?? ''),
							network: String(cardanoDRep[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((cardanoDRepFields.displayName) ?? ''), String((cardanoDRepFields.drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoDRepFields.credentialKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
