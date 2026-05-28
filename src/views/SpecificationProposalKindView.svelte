<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const kind = useEntity(
		EntityType.SpecificationProposalKind,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			$$proposals: {
				$: [
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
				$limit: 2048,
			},
			label: {},
			labelPlural: {},
			slug: {},
		},
	)

	const specificationRealm = useEntity(
		EntityType.SpecificationRealm,
		{
			realm: entityId.realm,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			slug: {},
		},
	)


	const href = $derived(
		hrefProp ?? (
			kind.slug != null && specificationRealm.slug != null ?
				resolve(
					'/proposals/[specificationRealmSlug]/[proposalKindSlug]',
					{
						specificationRealmSlug: specificationRealm.slug,
						proposalKindSlug: kind.slug,
					},
				)
			: specificationRealm.slug != null ?
				resolve(
					'/proposals/[specificationRealmSlug]',
					{
						specificationRealmSlug: specificationRealm.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	{entityId}
	{href}
	title={kind.labelPlural ?? kind.label ?? `${entityId.category}`}
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
					{kind.label ?? entityId.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(kind)}
				<span>
					{kind.labelPlural ?? kind.label ?? entityId.category}
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
				{kind.labelPlural ?? kind.label ?? entityId.category}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if (
				open
				&& kind.labelPlural !== undefined
			)}
				<div>
					<dt>Label plural</dt>
					<dd>
						<ResourceBoundary
							resource={kind}
							placeholderText="Loading proposal kind…"
						>
							{#snippet children(kind)}
								{kind.labelPlural}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.SpecificationProposalKind}
			{entityId}
		/>
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
						kind.labelPlural
						?? kind.label
						?? 'Proposals'
					}
				/>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
