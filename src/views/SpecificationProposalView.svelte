<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import {
		ProposalCategory,
		SpecificationRealm,
		proposalCategoryById,
		specificationRealmById,
	} from '$/constants/SpecificationProposal.ts'

	import { EntityType } from '$/schema/EntityType.ts'
	import ProposalSchema from '$/schema/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: typeof ProposalSchema.id.infer
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// Functions
	const proposalHeadingExtractBeforeIdentifier = (
		m: {
			documentBody?: string | null
			documentTitle?: string | null
		},
		proposalId: typeof ProposalSchema.id.infer,
	): string => {
		const trimmedTitle = (m.documentTitle ?? '').trim()
		const match = (
			proposalId.category === ProposalCategory.Ensip ?
				(m.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)
			:
				null
		)
		return (
			trimmedTitle !== '' ?
				trimmedTitle
			:
				(match?.[1] ?? '').trim()
		)
	}

	const proposalHeadingTitle = (
		m: {
			documentBody?: string | null
			documentTitle?: string | null
		},
		proposalId: typeof ProposalSchema.id.infer,
		kindLabel: string,
	) => {
		const identifier = `${kindLabel}-${proposalId.number}`
		const headingExtract = proposalHeadingExtractBeforeIdentifier(m, proposalId)
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


	const proposal = subscribe(EntityType.SpecificationProposal,
		entityId,
		({ sources: [
				entityId.realm === SpecificationRealm.Bitcoin && entityId.category === ProposalCategory.Bip ?
					Source.BitcoinBips_Github
				: entityId.realm === SpecificationRealm.BitcoinCash && entityId.category === ProposalCategory.Chip ?
					Source.BitcoinCashChips_Gitlab
				: entityId.realm === SpecificationRealm.ChainAgnostic && entityId.category === ProposalCategory.Caip ?
					Source.Caips_Github
				: entityId.realm === SpecificationRealm.Cosmos && entityId.category === ProposalCategory.Adr ?
					Source.CosmosAdrs_Github
				: entityId.realm === SpecificationRealm.Dogecoin && entityId.category === ProposalCategory.Dip ?
					Source.DogecoinDips_Github
				: entityId.realm === SpecificationRealm.Ens && entityId.category === ProposalCategory.Ensip ?
					Source.Ensips_Github
				:
					entityId.realm === SpecificationRealm.Ethereum
					&& (
						entityId.category === ProposalCategory.Eip
						|| entityId.category === ProposalCategory.Erc
					) ?
					Source.EthereumEips_Github
				: entityId.realm === SpecificationRealm.Filecoin && entityId.category === ProposalCategory.Fip ?
					Source.FilecoinFips_Github
				: entityId.realm === SpecificationRealm.Hyperliquid && entityId.category === ProposalCategory.Hip ?
					Source.HyperliquidDocs_Rest
				: entityId.realm === SpecificationRealm.Litecoin && entityId.category === ProposalCategory.Lip ?
					Source.LitecoinLips_Github
				: entityId.realm === SpecificationRealm.Near && entityId.category === ProposalCategory.Nep ?
					Source.NearNeps_Github
				: entityId.realm === SpecificationRealm.Polkadot && entityId.category === ProposalCategory.Rfc ?
					Source.PolkadotRfcs_Github
				: entityId.realm === SpecificationRealm.Quilibrium && entityId.category === ProposalCategory.ProtocolDocument ?
					Source.QuilibriumDocs_Rest
				: entityId.realm === SpecificationRealm.Solana && entityId.category === ProposalCategory.Simd ?
					Source.SolanaSimds_Github
				: entityId.realm === SpecificationRealm.Zcash && entityId.category === ProposalCategory.Zip ?
					Source.ZcashZips_Github
				:
					Source.Constants_Internal,
			], fields: { documentBody: true, documentCategory: true, documentStatus: true, documentTitle: true } }),
	)

	const specificationRealm = subscribe(EntityType.SpecificationRealm,
		{
			realm: entityId.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, slug: true } }),
	)

	const proposalKind = subscribe(EntityType.SpecificationProposalKind,
		{
			realm: entityId.realm,
			category: entityId.category,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, labelPlural: true, slug: true } }),
	)


	// (Derived)
	const href = $derived(
		hrefProp ?? resolve(
			'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]',
			{
				specificationRealmSlug: specificationRealmById[entityId.realm].slug,
				proposalKindSlug: proposalCategoryById[entityId.category].slug,
				proposalRef: `${proposalCategoryById[entityId.category].slug}-${entityId.number}`,
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
	{entityId}
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
					{`${proposalKind.fields.label ?? entityId.category}-${entityId.number}`}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${proposalCategoryById[entityId.category].label}-${entityId.number}`}
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
								proposal.fields,
								entityId,
								proposalKind.fields.label ?? entityId.category,
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
								{#if proposal.fields.documentCategory}
									{proposal.fields.documentCategory}
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
								{proposal.fields.documentStatus}
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
									{#if specificationRealm.fields.slug != null}
										<a href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
											specificationRealmSlug: specificationRealm.fields.slug,
										})}>
											{specificationRealm.fields.label ?? entityId.realm}
										</a>
									{:else}
										{specificationRealm.fields.label ?? entityId.realm}
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
											{#if specificationRealm.fields.slug != null && proposalKind.fields.slug != null}
												<a
													href={resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
														specificationRealmSlug: specificationRealm.fields.slug,
														proposalKindSlug: proposalKind.fields.slug,
													})}
												>
													{proposalKind.fields.labelPlural ?? proposalKind.fields.label ?? entityId.category}
												</a>
											{:else}
												{proposalKind.fields.labelPlural ?? proposalKind.fields.label ?? entityId.category}
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

	{#snippet Details({ open })}
		<section
			id={`${(`proposal:${entityId.realm}:${entityId.category}:${entityId.number}`)}:document-body`}
		>
			<ResourceBoundary
				resource={proposal}
				placeholderText="Loading proposal…"
			>
				{#snippet children(proposal)}
					<h3>Document body</h3>
					{#if !proposal.fields.documentBody}
						<p data-text="muted">No proposal body available.</p>
					{:else}
						<Markdown content={proposal.fields.documentBody} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>

	{/snippet}
</EntityView>
