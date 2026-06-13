<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


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

			entityId: EntityId<typeof schema, EntityType.SpecificationProposalKind>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()

	const kind = subscribe(EntityType.SpecificationProposalKind,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { $$proposals: ({ sources: [
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
				], limit: 2048 }), label: true, labelPlural: true, slug: true } }),
	)

	const specificationRealm = subscribe(EntityType.SpecificationRealm,
		{
			realm: entityId.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true } }),
	)


	// (Derived)
	const kindRow = $derived(
		kind.ready ?
			kind.current
			:
			undefined,
	)

	const specificationRealmRow = $derived(
		specificationRealm.ready ?
			specificationRealm.current
			:
			undefined,
	)

	const href = $derived(
		hrefProp ?? (
			kindRow?.fields.slug != null && specificationRealmRow?.fields.slug != null ?
				resolve(
					'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
					{
						specificationRealmSlug: specificationRealmRow.fields.slug,
						proposalKindSlug: kindRow.fields.slug,
					},
				)
			: specificationRealmRow?.fields.slug != null ?
				resolve(
					'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
					{
						specificationRealmSlug: specificationRealmRow.fields.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	{entityId}
	{href}
	title={kindRow?.fields.labelPlural ?? kindRow?.fields.label ?? `${entityId.category}`}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(kind)}
				<span>
					{kind.fields.label ?? entityId.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(kind)}
				<span>
					{kind.fields.labelPlural ?? kind.fields.label ?? entityId.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if (
				open
				&& kindRow?.fields.labelPlural !== undefined
			)}
				<div>
					<dt>Label plural</dt>
					<dd>
						<ResourceBoundary
							resource={kind}
							placeholderText="Loading proposal kind…"
						>
							{#snippet children(kind)}
								{kind.fields.labelPlural}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposals…"
		>
			{#snippet children(kind)}
				<ProposalsView
					href={resolve('/proposals')}
					entityFieldReference={{
						entityType: EntityType.SpecificationProposalKind,
						entityId,
						fieldName: '$$proposals',
					}}
					filterCategory={entityId.category}
					filterRealm={entityId.realm}
					id={`${stringify(entityId)}:proposals`}
					open
					title={
						kind.fields.labelPlural
						?? kind.fields.label
						?? 'Proposals'
					}
				/>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
