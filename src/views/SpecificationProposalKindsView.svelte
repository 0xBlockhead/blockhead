<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'


	// State
	let {
		selection,
		title = 'Proposal kinds',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SpecificationProposalKind> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationProposalKind}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				labelPlural: true,
				label: true,
				category: true,
			},
		})
	}
>
	{#snippet Item({ item: specificationProposalKind })}
		{@const specificationProposalKindSelector = specificationProposalKind[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SpecificationProposalKind}
			entitySelector={specificationProposalKindSelector}
			href={
				resolve(
					'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
					{
						specificationRealmSlug: specificationRealmById[specificationProposalKindSelector.realm].slug,
						proposalKindSlug: proposalCategoryById[specificationProposalKindSelector.category].slug,
					}
				)
			}
		>
			{#snippet Title()}
				{specificationProposalKind.labelPlural || (proposalCategoryById[specificationProposalKindSelector.category]?.labelPlural ?? specificationProposalKindSelector.category) || 'Specification proposal kind'}
			{/snippet}

			{#snippet Value()}
				{specificationProposalKind.label}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
