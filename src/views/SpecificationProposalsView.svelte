<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { specificationRealmById, proposalCategoryById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Proposals',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SpecificationProposals-list',
		filterRealm,
		filterCategory,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SpecificationProposal>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			filterRealm?: unknown
			filterCategory?: unknown
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()
	const selectedSources = $derived({
		'Bitcoin:Bip': [
			Source.BitcoinBips_Github,
		],
		'BitcoinCash:Chip': [
			Source.BitcoinCashChips_Gitlab,
		],
		'ChainAgnostic:Caip': [
			Source.Caips_Github,
		],
		'Cosmos:Adr': [
			Source.CosmosAdrs_Github,
		],
		'Dogecoin:Dip': [
			Source.DogecoinDips_Github,
		],
		'Ens:Ensip': [
			Source.Ensips_Github,
		],
		'Ethereum:Eip': [
			Source.EthereumEips_Github,
		],
		'Ethereum:Erc': [
			Source.EthereumEips_Github,
		],
		'Filecoin:Fip': [
			Source.FilecoinFips_Github,
		],
		'Hyperliquid:Hip': [
			Source.HyperliquidDocs_Rest,
		],
		'Litecoin:Lip': [
			Source.LitecoinLips_Github,
		],
		'Near:Nep': [
			Source.NearNeps_Github,
		],
		'Polkadot:Rfc': [
			Source.PolkadotRfcs_Github,
		],
		'Quilibrium:ProtocolDocument': [
			Source.QuilibriumDocs_Rest,
		],
		'Solana:Simd': [
			Source.SolanaSimds_Github,
		],
		'Zcash:Zip': [
			Source.ZcashZips_Github,
		],
	}[[String(filterRealm), String(filterCategory)].join(':')] ?? [
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
	])


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		These proposal cards come from public standards repositories for Bitcoin BIPs, Zcash ZIPs, Filecoin FIPs, Solana SIMDs, CAIPs, ENSIPs, and Ethereum EIPs/ERCs.
	</p>

	<p>
		They document design specs, not live on-chain vote tallies for a particular DAO.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				sources: selectedSources,
				count: true,
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(specificationProposals)}
			{@const uniqueSpecificationProposals = [...new Map(specificationProposals.values.filter((specificationProposal) => (filterRealm == null || specificationProposal[EntityMetaKey.Selector].realm === filterRealm) && (filterCategory == null || specificationProposal[EntityMetaKey.Selector].category === filterCategory)).map((specificationProposal) => [specificationProposal[EntityMetaKey.SelectorKey], specificationProposal])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SpecificationProposal}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={specificationProposals.totalCount}
				getKey={(specificationProposal) => specificationProposal[EntityMetaKey.SelectorKey]}
				items={uniqueSpecificationProposals}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Specification proposals yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: specificationProposal }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SpecificationProposal> })}
					{@const specificationProposalFields = { ...specificationProposal[EntityMetaKey.Selector], ...specificationProposal }}
					{@const specificationProposalHrefFields = { ...specificationProposal, ...specificationProposal[EntityMetaKey.Selector] }}
					<SpecificationProposalView
						selection={select(EntityType.SpecificationProposal, specificationProposal[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={specificationProposalFields}
						href={
							(specificationProposalHrefFields.realm !== undefined && specificationProposalHrefFields.category !== undefined && specificationProposalHrefFields.number !== undefined ? resolve('/proposals/[specificationRealmSlug=specificationRealmSlug]/[proposalKindSlug=proposalKindSlug]/[proposalRef=proposalRef]', {
								specificationRealmSlug: String(specificationRealmById[String(specificationProposalHrefFields.realm)].slug ?? ''),
								proposalKindSlug: String(proposalCategoryById[String(specificationProposalHrefFields.category)].slug ?? ''),
								proposalRef: `${String(String(proposalCategoryById[String(specificationProposalHrefFields.category)].label ?? '') ?? '')}-${String(specificationProposalHrefFields.number ?? '')}`,
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.SpecificationProposal}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
