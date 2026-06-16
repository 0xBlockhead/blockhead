<script lang="ts">
	// Types/constants
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
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SpecificationProposal>
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


	const proposal = $derived(subscribe(EntityType.SpecificationProposal,
		selector,
		({ sources: [
				selector.realm === SpecificationRealm.Bitcoin && selector.category === ProposalCategory.Bip ?
					Source.BitcoinBips_Github
				: selector.realm === SpecificationRealm.BitcoinCash && selector.category === ProposalCategory.Chip ?
					Source.BitcoinCashChips_Gitlab
				: selector.realm === SpecificationRealm.ChainAgnostic && selector.category === ProposalCategory.Caip ?
					Source.Caips_Github
				: selector.realm === SpecificationRealm.Cosmos && selector.category === ProposalCategory.Adr ?
					Source.CosmosAdrs_Github
				: selector.realm === SpecificationRealm.Dogecoin && selector.category === ProposalCategory.Dip ?
					Source.DogecoinDips_Github
				: selector.realm === SpecificationRealm.Ens && selector.category === ProposalCategory.Ensip ?
					Source.Ensips_Github
				:
					selector.realm === SpecificationRealm.Ethereum
					&& (
						selector.category === ProposalCategory.Eip
						|| selector.category === ProposalCategory.Erc
					) ?
					Source.EthereumEips_Github
				: selector.realm === SpecificationRealm.Filecoin && selector.category === ProposalCategory.Fip ?
					Source.FilecoinFips_Github
				: selector.realm === SpecificationRealm.Hyperliquid && selector.category === ProposalCategory.Hip ?
					Source.HyperliquidDocs_Rest
				: selector.realm === SpecificationRealm.Litecoin && selector.category === ProposalCategory.Lip ?
					Source.LitecoinLips_Github
				: selector.realm === SpecificationRealm.Near && selector.category === ProposalCategory.Nep ?
					Source.NearNeps_Github
				: selector.realm === SpecificationRealm.Polkadot && selector.category === ProposalCategory.Rfc ?
					Source.PolkadotRfcs_Github
				: selector.realm === SpecificationRealm.Quilibrium && selector.category === ProposalCategory.ProtocolDocument ?
					Source.QuilibriumDocs_Rest
				: selector.realm === SpecificationRealm.Solana && selector.category === ProposalCategory.Simd ?
					Source.SolanaSimds_Github
				: selector.realm === SpecificationRealm.Zcash && selector.category === ProposalCategory.Zip ?
					Source.ZcashZips_Github
				:
					Source.Constants_Internal,
			], fields: { documentBody: true, documentCategory: true, documentStatus: true, documentTitle: true } }),
	))

	const specificationRealm = $derived(subscribe(EntityType.SpecificationRealm,
		{
			realm: selector.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, slug: true } }),
	))

	const proposalKind = $derived(subscribe(EntityType.SpecificationProposalKind,
		{
			realm: selector.realm,
			category: selector.category,
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
				specificationRealmSlug: specificationRealmById[selector.realm].slug,
				proposalKindSlug: proposalCategoryById[selector.category].slug,
				proposalRef: `${proposalCategoryById[selector.category].slug}-${selector.number}`,
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
	entitySelector={selector}
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
					{`${proposalKind.fields.label ?? selector.category}-${selector.number}`}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${proposalCategoryById[selector.category].label}-${selector.number}`}
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
								selector,
								proposalKind.fields.label ?? selector.category,
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
											{specificationRealm.fields.label ?? selector.realm}
										</a>
									{:else}
										{specificationRealm.fields.label ?? selector.realm}
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
													{proposalKind.fields.labelPlural ?? proposalKind.fields.label ?? selector.category}
												</a>
											{:else}
												{proposalKind.fields.labelPlural ?? proposalKind.fields.label ?? selector.category}
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
			id={`proposal:${selector.realm}:${selector.category}:${selector.number}:document-body`}
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
