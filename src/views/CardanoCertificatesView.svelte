<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Cardano certificates',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoCertificates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoCertificate>
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
	entityType={EntityType.CardanoCertificate}
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
				certificateKind: true,
				certificateIndex: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoCertificates) => [...new Map(cardanoCertificates.values.map((cardanoCertificate) => [cardanoCertificate[EntityMetaKey.SelectorKey], cardanoCertificate])).values()]}
	getKey={(cardanoCertificate) => cardanoCertificate[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano certificates yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoCertificate })}
		{@const cardanoCertificateFields = { ...cardanoCertificate[EntityMetaKey.Selector], ...cardanoCertificate }}
		<EntityView
			entityType={EntityType.CardanoCertificate}
			entitySelector={cardanoCertificate[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoCertificateFields.certificateKind) ?? ''), (String((cardanoCertificateFields.certificateIndex) ?? '') ? 'Certificate #' + String((cardanoCertificateFields.certificateIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano certificate'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
