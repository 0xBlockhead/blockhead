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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoDRep>
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
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
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
				drepCredential: true,
				credentialKind: true,
				$network: true,
			},
		})
	}
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
		{@const selection = select(EntityType.CardanoDRep, cardanoDRep[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const cardanoDRepHrefFields = { ...cardanoDRep, ...cardanoDRep[EntityMetaKey.Selector] }}
		<CardanoDRepView
			selection={selection}
			prefetched={cardanoDRepFields}
			href={
				(cardanoDRepHrefFields.drepCredential !== undefined && cardanoDRepHrefFields.$network !== undefined && cardanoDRepHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
					drepCredential: String(cardanoDRepHrefFields.drepCredential ?? ''),
					network: String(caip2StringFromValue(cardanoDRepHrefFields.$network.caip2) ?? ''),
				}) : cardanoDRepHrefFields.drepCredential !== undefined && cardanoDRepHrefFields.$network !== undefined && cardanoDRepHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
					drepCredential: String(cardanoDRepHrefFields.drepCredential ?? ''),
					network: String(cardanoDRepHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
