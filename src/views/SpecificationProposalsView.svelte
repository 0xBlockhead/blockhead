<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { RegisteredEntitySelector } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import specificationProposalSources from '$/sources/specificationProposalSources.ts'


	// State
	let {
		selection,
		title = 'Proposals',
		open = $bindable(true),
		filterRealm,
		filterCategory,
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.SpecificationProposal,
		{
			filterRealm?: RegisteredEntitySelector<EntityType.SpecificationProposal>['realm']
			filterCategory?: RegisteredEntitySelector<EntityType.SpecificationProposal>['category']
		}
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		These proposal cards come from public standards repositories for Bitcoin BIPs, Zcash ZIPs, Filecoin FIPs, Solana SIMDs, CAIPs, ENSIPs, and Ethereum EIPs/ERCs.
	</p>

	<p>
		They document design specs, not live on-chain vote tallies for a particular DAO.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationProposal}
	{title}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: specificationProposalSources({
				realm: filterRealm,
				category: filterCategory,
			}),
		})
	}
	getResourceItems={
		(specificationProposals) => specificationProposals.values.filter(
			(specificationProposal) => (
				(filterRealm == null || specificationProposal[EntityMetaKey.Selector].realm === filterRealm)
				&& (filterCategory == null || specificationProposal[EntityMetaKey.Selector].category === filterCategory)
			)
		)
	}
>
	{#snippet Item({ item: specificationProposal })}
		{@const specificationProposalSelector = specificationProposal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SpecificationProposal}
			entitySelector={specificationProposalSelector}
			href={
				resolve(
					'/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
					{
						specificationRealmSlug: specificationRealmById[specificationProposalSelector.realm].slug,
						proposalKindSlug: proposalCategoryById[specificationProposalSelector.category].slug,
						proposalRef: `${proposalCategoryById[specificationProposalSelector.category].label}-${specificationProposalSelector.number}`,
					}
				)
			}
		>
			{#snippet Title()}
				{
					[
							[(proposalCategoryById[specificationProposalSelector.category]?.label ?? specificationProposalSelector.category) + '-', String(specificationProposalSelector.number)].filter(Boolean).join(''),
							(specificationProposal.documentTitle ?? ''),
						]
							.filter(Boolean)
							.join(': ')
						|| [
							(proposalCategoryById[specificationProposalSelector.category]?.label ?? specificationProposalSelector.category),
							String(specificationProposalSelector.number),
						]
							.filter(Boolean)
							.join('-')
						|| 'Specification proposal'
				}
			{/snippet}

			{#snippet Value()}
				{
					[
						(proposalCategoryById[specificationProposalSelector.category]?.label ?? specificationProposalSelector.category),
						specificationProposalSelector.number,
					]
						.filter(Boolean)
						.join('-')
				}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
