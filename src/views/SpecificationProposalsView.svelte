<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { ProposalCategory, SpecificationRealm } from '$/constants/SpecificationProposal.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'


	// State
	let {
		title = 'Proposals',

		open = $bindable(true),
		entityFieldReference,
		filterCategory,
		filterRealm,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.SpecificationProposal>
			filterCategory?: ProposalCategory
			filterRealm?: SpecificationRealm
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'id'
			| 'Item'
			| 'ItemPlaceholder'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const specificationProposalSources = [
		Source.BitcoinBips_Github,
		Source.BitcoinCashChips_Gitlab,
		Source.Caips_Github,
		Source.CosmosAdrs_Github,
		Source.DogecoinDips_Github,
		Source.Ensips_Github,
		Source.EthereumEips_Github,
		Source.FilecoinFips_Github,
		Source.HyperliquidDocs_Rest,
		Source.LitecoinLips_Github,
		Source.NearNeps_Github,
		Source.PolkadotRfcs_Github,
		Source.QuilibriumDocs_Rest,
		Source.SolanaSimds_Github,
		Source.ZcashZips_Github,
	]

	const effectiveFilterRealm = $derived(
		filterRealm ?? (
			entityFieldReference.entityType === EntityType.SpecificationProposalKind ?
				entityFieldReference.entityId.realm
			:
				undefined
		),
	)

	const effectiveFilterCategory = $derived(
		filterCategory ?? (
			entityFieldReference.entityType === EntityType.SpecificationProposalKind ?
				entityFieldReference.entityId.category
			:
				undefined
		),
	)

	const selectedSpecificationProposalSources = $derived(
		effectiveFilterRealm === SpecificationRealm.Bitcoin && effectiveFilterCategory === ProposalCategory.Bip ?
			[Source.BitcoinBips_Github]
		: effectiveFilterRealm === SpecificationRealm.BitcoinCash && effectiveFilterCategory === ProposalCategory.Chip ?
			[Source.BitcoinCashChips_Gitlab]
		: effectiveFilterRealm === SpecificationRealm.ChainAgnostic && effectiveFilterCategory === ProposalCategory.Caip ?
			[Source.Caips_Github]
		: effectiveFilterRealm === SpecificationRealm.Cosmos && effectiveFilterCategory === ProposalCategory.Adr ?
			[Source.CosmosAdrs_Github]
		: effectiveFilterRealm === SpecificationRealm.Dogecoin && effectiveFilterCategory === ProposalCategory.Dip ?
			[Source.DogecoinDips_Github]
		: effectiveFilterRealm === SpecificationRealm.Ens && effectiveFilterCategory === ProposalCategory.Ensip ?
			[Source.Ensips_Github]
		: effectiveFilterRealm === SpecificationRealm.Ethereum
			&& (
				effectiveFilterCategory === ProposalCategory.Eip
				|| effectiveFilterCategory === ProposalCategory.Erc
			) ?
			[Source.EthereumEips_Github]
		: effectiveFilterRealm === SpecificationRealm.Filecoin && effectiveFilterCategory === ProposalCategory.Fip ?
			[Source.FilecoinFips_Github]
		: effectiveFilterRealm === SpecificationRealm.Hyperliquid && effectiveFilterCategory === ProposalCategory.Hip ?
			[Source.HyperliquidDocs_Rest]
		: effectiveFilterRealm === SpecificationRealm.Litecoin && effectiveFilterCategory === ProposalCategory.Lip ?
			[Source.LitecoinLips_Github]
		: effectiveFilterRealm === SpecificationRealm.Near && effectiveFilterCategory === ProposalCategory.Nep ?
			[Source.NearNeps_Github]
		: effectiveFilterRealm === SpecificationRealm.Polkadot && effectiveFilterCategory === ProposalCategory.Rfc ?
			[Source.PolkadotRfcs_Github]
		: effectiveFilterRealm === SpecificationRealm.Quilibrium && effectiveFilterCategory === ProposalCategory.ProtocolDocument ?
			[Source.QuilibriumDocs_Rest]
		: effectiveFilterRealm === SpecificationRealm.Solana && effectiveFilterCategory === ProposalCategory.Simd ?
			[Source.SolanaSimds_Github]
		: effectiveFilterRealm === SpecificationRealm.Zcash && effectiveFilterCategory === ProposalCategory.Zip ?
			[Source.ZcashZips_Github]
		:
			specificationProposalSources,
	)

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				...selectedSpecificationProposalSources,
			],
			[entityFieldReference.fieldName]: {
				$: selectedSpecificationProposalSources,
				$limit: 2048,
			},
		},
	)

	const proposals = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.SpecificationProposal>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows
					.filter((proposal) => (
						(effectiveFilterRealm == null || proposal[EntityMetaKey.Id].realm === effectiveFilterRealm)
						&& (effectiveFilterCategory == null || proposal[EntityMetaKey.Id].category === effectiveFilterCategory)
					))
					.map((proposal) => ({
						result: proposal,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SpecificationProposal}
	{title}
	bind:open
	getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
	getSortValue={(row) => row.result[EntityMetaKey.Id].number}
	layout={EntitiesListLayout.Default}
	placeholderKeys={new SvelteSet<string | number>()}
	resource={proposals}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			These proposal cards come from public standards repositories for Bitcoin BIPs, Zcash ZIPs, Filecoin FIPs, Solana SIMDs, CAIPs, ENSIPs, and Ethereum EIPs/ERCs.
		</p>
		<p>
			They document design specs—not live on-chain vote tallies for a particular DAO.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No proposals in this slice yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const proposalEntityId = item.result[EntityMetaKey.Id]}
		<ProposalView
			entityId={proposalEntityId}
			layout={EntityLayout.SummaryInline}
			open={false}
		/>
	{/snippet}
</EntitiesList>
