<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposalKind>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SpecificationProposalKind>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const specificationProposalKind = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
			labelPlural: true,
			slug: true,
			$specificationRealm: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.labelPlural) ?? '')].filter(Boolean).join(' ') || [String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.labelPlural ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind')
	const viewDomId = $derived('specification-proposal-kind-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import SpecificationProposalsView from '$/views/SpecificationProposalsView.svelte'
	import SpecificationRealmView from '$/views/SpecificationRealmView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.realm !== undefined && pendingEntity.category !== undefined ? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
			specificationRealmSlug: String(specificationRealmById[String(pendingEntity.realm)].slug ?? ''),
			proposalKindSlug: String(proposalCategoryById[String(pendingEntity.category)].slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={specificationProposalKind}>
			{#snippet Pending()}
				{[String((prefetched.labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.labelPlural ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={specificationProposalKind}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((prefetched.labelPlural) ?? '')].filter(Boolean).join(' ') || title || [String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.labelPlural ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '')].filter(Boolean).join(' ') || 'Specification proposal kind'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.labelPlural) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Realm</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									realm: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const realm = selection.entitySelector.realm ?? prefetched.realm}
							{#if realm !== undefined && realm !== null}
								{String((realm) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const realm = resolvedEntity.realm}
							{#if realm !== undefined && realm !== null}
								{String((realm) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slug</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									slug: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const slug = prefetched.slug}
							{#if slug !== undefined && slug !== null}
								{String((slug) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slug = resolvedEntity.slug}
							{#if slug !== undefined && slug !== null}
								{String((slug) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Specification realm</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.SpecificationRealm, false>('$specificationRealm')}
					>
						{#snippet children(specificationRealm)}
							{#if specificationRealm[EntityMetaKey.Selector] != null}
								<SpecificationRealmView
									selection={select(EntityType.SpecificationRealm, specificationRealm[EntityMetaKey.Selector])}
									prefetched={specificationRealm}
									href={
										(specificationRealm[EntityMetaKey.Selector].realm !== undefined ? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
											specificationRealmSlug: String(specificationRealmById[String(specificationRealm[EntityMetaKey.Selector].realm)].slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ResourceBoundary
				resource={
						selection({
							fields: {
								labelPlural: true,
							},
						})
					}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<SpecificationProposalsView
						selection={
								selection[EntityProxyField]<EntityType.SpecificationProposal>('$$proposals', {
									sources: [
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
									],
								})
							}
						title={String(entity.labelPlural ?? 'Proposals')}
						emptyText='No proposals for this kind.'
						filterRealm={selection.entitySelector.realm}
						filterCategory={selection.entitySelector.category}
						id='SpecificationProposalsView-$$proposals'
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
