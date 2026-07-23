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
	import { specificationRealmById } from '$/constants/SpecificationProposal.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SpecificationRealm>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.SpecificationRealm}
			entitySelector={specificationRealm[EntityMetaKey.Selector]}
			href={
				(
					specificationRealm[EntityMetaKey.Selector] != null && 'realm' in specificationRealm[EntityMetaKey.Selector]
					&& specificationRealm[EntityMetaKey.Selector].realm != null ?
						resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]', {
					specificationRealmSlug: String(specificationRealmById[String(specificationRealm[EntityMetaKey.Selector].realm)].slug ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((specificationRealmFields.label) ?? '')].filter(Boolean).join(' ') || [String((specificationRealmFields.realm) ?? '')].filter(Boolean).join(' ') || 'Specification realm'}
			{/snippet}

			{#snippet Value()}
				{[String((specificationRealmFields.realm) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
