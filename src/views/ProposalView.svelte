<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import {
		ProposalCategory,
		proposalCategoryById,
		proposalRealmById,
	} from '$/constants/Proposal.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalSchema from '$/schema/Proposal.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: typeof ProposalSchema.id.infer
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// Functions
	const proposalHeadingExtractBeforeIdentifier = (
		m: {
			documentBody?: string | null
			documentTitle?: string | null
		},
		proposalEntityId: typeof ProposalSchema.id.infer,
	): string => {
		const trimmedTitle = (m.documentTitle ?? '').trim()
		const match = (
			proposalEntityId.category === ProposalCategory.Ensip ?
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
		proposalEntityId: typeof ProposalSchema.id.infer,
	) => {
		const identifier = `${proposalCategoryById[proposalEntityId.category].label}-${proposalEntityId.number}`
		const headingExtract = proposalHeadingExtractBeforeIdentifier(m, proposalEntityId)
		return (
			headingExtract === '' ?
				identifier
			:	new RegExp(
					`^${identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
					'i',
				).test(headingExtract) ?
					headingExtract
				:
					`${identifier.trim()}: ${headingExtract}`
		)
	}


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const proposal = useEntity(
		EntityType.Proposal,
		entityId,
		{
			$: [
				entityId.category === ProposalCategory.Caip ?
					Source.Caips_Github
				: entityId.category === ProposalCategory.Ensip ?
					Source.Ensips_Github
				:
					Source.EthereumEips_Github,
			],
			documentBody: {},
			documentCategory: {},
			documentStatus: {},
			documentTitle: {},
		},
	)


	const proposalDomId = $derived(
		`proposal:${entityId.realm}:${entityId.category}:${entityId.number}`
	)

	const hideHeadingSecondarySummaryFromProposalIdentifierFallbackOnly = $derived(
		proposal.ready
		&& proposalHeadingExtractBeforeIdentifier(proposal.current, entityId) === '',
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={proposal}
			placeholderText="Loading proposal…"
		>
			{#snippet children(p)}
				{proposalHeadingTitle(p, entityId)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{`${proposalCategoryById[entityId.category].label}-${entityId.number}`}
		</span>
	{/snippet}



	{#snippet TypeAnnotationTooltip()}
<p>
					Each entry is a numbered specification pulled from upstream documentation trees, grouped first by stewarding realm, then by document family.
				</p>
				<p>
					Catalog entries capture stewarded specification text and lifecycle status; live vote weights and treasury execution are tracked in governance systems on-chain or in forums.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={proposal}
			placeholderText="Loading proposal…"
		>
			{#snippet children(p)}
				<dl data-column-item="center">
					{#if !hideHeadingSecondarySummaryFromProposalIdentifierFallbackOnly}
						<div>
							<dt>Catalog ref</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
					{/if}

					{#if p.documentCategory}
						<div>
							<dt>Category</dt>
							<dd>{p.documentCategory}</dd>
						</div>
					{/if}
					<div>
						<dt>Status</dt>
						<dd>{p.documentStatus}</dd>
					</div>
					{#if open}
						<div>
							<dt>Realm</dt>
							<dd>
								<a href={resolve(`/proposals/${proposalRealmById[entityId.realm].slug}`)}>
									{proposalRealmById[entityId.realm].label}
								</a>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Kind</dt>
							<dd>
								<a href={resolve(`/proposals/${proposalRealmById[entityId.realm].slug}/${proposalCategoryById[entityId.category].slug}`)}>
									{proposalCategoryById[entityId.category].labelPlural}
								</a>
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
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Proposal}
			{entityId}
		/>

		<div data-column="gap-3">
			<CollapsibleTabs
				id={`${proposalDomId}:carousel`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Document</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Document body"
						href={`#${proposalDomId}:document-body`}
					>Document body</a>
					<a
						data-scroll-marker-label="Metadata"
						href={`#${proposalDomId}:metadata`}
					>Metadata</a>
				{/snippet}

				{#snippet children(_childrenContext)}
					<section
						id={`${proposalDomId}:document-body`}
					>
						<ResourceBoundary
							resource={proposal}
							placeholderText="Loading proposal…"
						>
							{#snippet children(p)}
								{#if !p.documentBody}
									<p data-text="muted">No proposal body available.</p>
								{:else}
									<Markdown content={p.documentBody} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<section
						id={`${proposalDomId}:metadata`}
					>
						<ResourceBoundary
							resource={proposal}
							placeholderText="Loading proposal…"
						>
							{#snippet children(p)}
								<dl data-column-item="center">
									{#if p.documentCategory}
										<div>
											<dt>Category</dt>
											<dd>{p.documentCategory}</dd>
										</div>
									{/if}
									<div>
										<dt>Status</dt>
										<dd>{p.documentStatus}</dd>
									</div>
									<div>
										<dt>Realm</dt>
										<dd>
											<a href={resolve(`/proposals/${proposalRealmById[entityId.realm].slug}`)}>
												{proposalRealmById[entityId.realm].label}
											</a>
										</dd>
									</div>
									<div>
										<dt>Kind</dt>
										<dd>
											<a href={resolve(`/proposals/${proposalRealmById[entityId.realm].slug}/${proposalCategoryById[entityId.category].slug}`)}>
												{proposalCategoryById[entityId.category].labelPlural}
											</a>
										</dd>
									</div>
								</dl>
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
