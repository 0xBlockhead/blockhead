<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'

	import {
		ProposalCategory,
		SpecificationRealm,
		proposalCategoryById,
		specificationRealmById,
	} from '$/constants/SpecificationProposal.ts'

	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposal>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// Functions
	const proposalHeadingTitle = (
		m: {
			documentBody?: string | null
			documentTitle?: string | null
		},
		proposalId: EntitySelector<typeof schema, EntityType.SpecificationProposal>,
		kindLabel: string,
	) => {
		const identifier = `${kindLabel}-${proposalId.number}`
		const headingExtract = (
			(m.documentTitle ?? '').trim() !== '' ?
				(m.documentTitle ?? '').trim()
			: proposalId.category === ProposalCategory.Ensip ?
				((m.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1] ?? '').trim()
			:
				''
		)
		return (
			headingExtract === '' ?
				identifier
			:
				new RegExp(
					`^${identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
					'i',
				).test(headingExtract) ?
					headingExtract
				:
					`${identifier.trim()}: ${headingExtract}`
		)
	}


	const proposal = $derived(selection(
		({ sources: [
				selection.entitySelector.realm === SpecificationRealm.Bitcoin && selection.entitySelector.category === ProposalCategory.Bip ?
					Source.BitcoinBips_Github
				: selection.entitySelector.realm === SpecificationRealm.BitcoinCash && selection.entitySelector.category === ProposalCategory.Chip ?
					Source.BitcoinCashChips_Gitlab
				: selection.entitySelector.realm === SpecificationRealm.ChainAgnostic && selection.entitySelector.category === ProposalCategory.Caip ?
					Source.Caips_Github
				: selection.entitySelector.realm === SpecificationRealm.Cosmos && selection.entitySelector.category === ProposalCategory.Adr ?
					Source.CosmosAdrs_Github
				: selection.entitySelector.realm === SpecificationRealm.Dogecoin && selection.entitySelector.category === ProposalCategory.Dip ?
					Source.DogecoinDips_Github
				: selection.entitySelector.realm === SpecificationRealm.Ens && selection.entitySelector.category === ProposalCategory.Ensip ?
					Source.Ensips_Github
				:
					selection.entitySelector.realm === SpecificationRealm.Ethereum
					&& (
						selection.entitySelector.category === ProposalCategory.Eip
						|| selection.entitySelector.category === ProposalCategory.Erc
					) ?
					Source.EthereumEips_Github
				: selection.entitySelector.realm === SpecificationRealm.Filecoin && selection.entitySelector.category === ProposalCategory.Fip ?
					Source.FilecoinFips_Github
				: selection.entitySelector.realm === SpecificationRealm.Hyperliquid && selection.entitySelector.category === ProposalCategory.Hip ?
					Source.HyperliquidDocs_Rest
				: selection.entitySelector.realm === SpecificationRealm.Litecoin && selection.entitySelector.category === ProposalCategory.Lip ?
					Source.LitecoinLips_Github
				: selection.entitySelector.realm === SpecificationRealm.Near && selection.entitySelector.category === ProposalCategory.Nep ?
					Source.NearNeps_Github
				: selection.entitySelector.realm === SpecificationRealm.Polkadot && selection.entitySelector.category === ProposalCategory.Rfc ?
					Source.PolkadotRfcs_Github
				: selection.entitySelector.realm === SpecificationRealm.Quilibrium && selection.entitySelector.category === ProposalCategory.ProtocolDocument ?
					Source.QuilibriumDocs_Rest
				: selection.entitySelector.realm === SpecificationRealm.Solana && selection.entitySelector.category === ProposalCategory.Simd ?
					Source.SolanaSimds_Github
				: selection.entitySelector.realm === SpecificationRealm.Zcash && selection.entitySelector.category === ProposalCategory.Zip ?
					Source.ZcashZips_Github
				:
					Source.Constants_Internal,
			], fields: { documentBody: true, documentCategory: true, documentStatus: true, documentTitle: true } }),
	))

	const specificationRealm = $derived(select(EntityType.SpecificationRealm,
		{
			realm: selection.entitySelector.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, slug: true } }),
	))

	const proposalKind = $derived(select(EntityType.SpecificationProposalKind,
		{
			realm: selection.entitySelector.realm,
			category: selection.entitySelector.category,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, labelPlural: true, slug: true } }),
	))


	// (Derived)
	const href = $derived(
		hrefProp ?? resolve(
			'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]',
			{
				specificationRealmSlug: specificationRealmById[selection.entitySelector.realm].slug,
				proposalKindSlug: proposalCategoryById[selection.entitySelector.category].slug,
				proposalRef: `${proposalCategoryById[selection.entitySelector.category].slug}-${selection.entitySelector.number}`,
			},
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={proposalKind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(proposalKind)}
				<span>
					{`${proposalKind.label ?? selection.entitySelector.category}-${selection.entitySelector.number}`}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${proposalCategoryById[selection.entitySelector.category].label}-${selection.entitySelector.number}`}
		{:else}
			<ResourceBoundary
				resource={proposal}
				placeholderText="Loading proposal…"
			>
				{#snippet children(proposal)}
					<ResourceBoundary
						resource={proposalKind}
						placeholderText="Loading proposal kind…"
					>
						{#snippet children(proposalKind)}
							{proposalHeadingTitle(
								proposal,
								selection.entitySelector,
								proposalKind.label ?? selection.entitySelector.category,
							)}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each entry is a numbered specification pulled from upstream documentation trees, grouped first by stewarding realm, then by document family.
		</p>
		<p>
			Catalog entries capture stewarded specification text and lifecycle status; live vote weights and treasury execution are tracked in governance systems on-chain or in forums.
		</p>
	{/snippet}

	{#snippet Content({})}
		{#if layout !== EntityLayout.SummaryInline}
			<dl data-column-item="center">
				<div>
					<dt>Category</dt>
					<dd>
						<ResourceBoundary
							resource={proposal}
							placeholderText="Loading proposal…"
						>
							{#snippet children(proposal)}
								{#if proposal.documentCategory}
									{proposal.documentCategory}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Status</dt>
					<dd>
						<ResourceBoundary
							resource={proposal}
							placeholderText="Loading proposal…"
						>
							{#snippet children(proposal)}
								{proposal.documentStatus}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				{#if open}
					<div>
						<dt>Realm</dt>
						<dd>
							<ResourceBoundary
								resource={specificationRealm}
								placeholderText="Loading specification realm…"
							>
								{#snippet children(specificationRealm)}
									{#if specificationRealm.slug != null}
										<a href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
											specificationRealmSlug: specificationRealm.slug,
										})}>
											{specificationRealm.label ?? selection.entitySelector.realm}
										</a>
									{:else}
										{specificationRealm.label ?? selection.entitySelector.realm}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Kind</dt>
						<dd>
							<ResourceBoundary
								resource={specificationRealm}
								placeholderText="Loading specification realm…"
							>
								{#snippet children(specificationRealm)}
									<ResourceBoundary
										resource={proposalKind}
										placeholderText="Loading proposal kind…"
									>
										{#snippet children(proposalKind)}
											{#if specificationRealm.slug != null && proposalKind.slug != null}
												<a
													href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
														specificationRealmSlug: specificationRealm.slug,
														proposalKindSlug: proposalKind.slug,
													})}
												>
													{proposalKind.labelPlural ?? proposalKind.label ?? selection.entitySelector.category}
												</a>
											{:else}
												{proposalKind.labelPlural ?? proposalKind.label ?? selection.entitySelector.category}
											{/if}
										{/snippet}
									</ResourceBoundary>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Governance votes</dt>
						<dd data-row="wrap align-center gap-2">
							<span>Not shown here.</span>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Standards repositories document process and normative text; DAO vote totals and treasury spend need the chain, Snapshot, or each org’s own dashboards.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="Why tallies are absent"
								>ⓘ</abbr>
							</Tooltip>
						</dd>
					</div>
				{/if}

			</dl>
		{/if}
	{/snippet}

	{#snippet Details()}
		<section
			id={`proposal:${selection.entitySelector.realm}:${selection.entitySelector.category}:${selection.entitySelector.number}:document-body`}
		>
			<ResourceBoundary
				resource={proposal}
				placeholderText="Loading proposal…"
			>
				{#snippet children(proposal)}
					<h3>Document body</h3>
					{#if !proposal.documentBody}
						<p data-text="muted">No proposal body available.</p>
					{:else}
						<Markdown content={proposal.documentBody} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>

	{/snippet}
</EntityView>
