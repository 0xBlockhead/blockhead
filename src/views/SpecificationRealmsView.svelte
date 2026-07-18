<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Specification realms',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationRealms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SpecificationRealm>
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
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationRealm}
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
				label: true,
				realm: true,
			},
		})
	}
	getResourceItems={(specificationRealms) => [...new Map(specificationRealms.values.map((specificationRealm) => [specificationRealm[EntityMetaKey.SelectorKey], specificationRealm])).values()]}
	getKey={(specificationRealm) => specificationRealm[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Specification realms yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: specificationRealm })}
		{@const specificationRealmFields = { ...specificationRealm[EntityMetaKey.Selector], ...specificationRealm }}
		{@const selection = select(EntityType.SpecificationRealm, specificationRealm[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const specificationRealmHrefFields = { ...specificationRealm, ...specificationRealm[EntityMetaKey.Selector] }}
		<SpecificationRealmView
			selection={selection}
			prefetched={specificationRealmFields}
			href={
				(specificationRealmHrefFields.realm !== undefined ? resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
					specificationRealmSlug: String(specificationRealmById[String(specificationRealmHrefFields.realm)].slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
