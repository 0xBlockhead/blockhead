<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import specificationProposalSources from '$/sources/specificationProposalSources.ts'


	// State
	let {
		selection,
		title = 'Proposals',
		limit = 64,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.SpecificationProposal,
		{
			limit?: number
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
			...{
				sources: selection.sources ?? specificationProposalSources({}),
				fields: {
					documentTitle: true,
					number: true,
				},
			},
			limit: limit,
		})
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
