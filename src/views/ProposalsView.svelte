<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal/ProposalCategory.ts'
	import {
		ProposalRealm,
		proposalRealmById,
	} from '$/constants/Proposal/ProposalRealm.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Functions
	const rowEntityId = (row: { [EntityMetaKey.Id]: unknown }) => row[EntityMetaKey.Id]

	const caipCatalogSortKey = (row: { [EntityMetaKey.Id]: unknown }) => {
		const caipId = rowEntityId(row)
		return (
			typeof caipId === 'object'
			&& caipId != null
			&& 'id' in caipId
			&& typeof caipId.id === 'string' ?
				caipId.id
			:
				''
		)
	}

const isProposalRealm = (value: unknown): value is ProposalRealm => (
	typeof value === 'string' && value in proposalRealmById
)

const isProposalCategory = (value: unknown): value is ProposalCategory => (
	typeof value === 'string' && value in proposalCategoryById
)

const proposalWireParts = (wire: unknown) => {
	if (wire == null || typeof wire !== 'object') return null
	const proposalWire = wire as Record<string, unknown>
	return (
		isProposalRealm(proposalWire.realm)
		&& isProposalCategory(proposalWire.category)
		&& typeof proposalWire.number === 'number'
		&& Number.isFinite(proposalWire.number) ?
			{
				realm: proposalWire.realm,
				category: proposalWire.category,
				number: proposalWire.number,
			}
		:
			null
	)
}

const proposalHref = (wire: unknown) => {
	const proposalIdParts = proposalWireParts(wire)
	if (proposalIdParts == null) return resolve('/proposals')
	return (
		resolve(
			'/(explore)/(proposals)/proposal/[proposalRealmId]/[proposalId]',
			{
				proposalRealmId: proposalRealmById[proposalIdParts.realm].slug,
				proposalId: `${proposalCategoryById[proposalIdParts.category].slug}-${proposalIdParts.number}`,
			},
		)
	)
}

	const proposalEntityIdOrNull = (
		wire: unknown,
	): EntityId<typeof schema, EntityType.Proposal> | null => {
	const proposalIdParts = proposalWireParts(wire)
	if (proposalIdParts == null) return null
		return {
		realm: proposalIdParts.realm,
		category: proposalIdParts.category,
		number: proposalIdParts.number,
		}
	}

const proposalCatalogRowKey = (proposalCatalogRow: { [EntityMetaKey.Id]: unknown }) => (
	stringify(proposalCatalogRow[EntityMetaKey.Id]) ?? ''
)


	// Props
	let {
		id = 'proposals',
		href = resolve('/proposals'),
		title = 'Proposals',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			id?: string
			href?: string
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const globalParentKey = stringify({})
	const eipsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$proposalsEips: entityFieldCollections[EntityType._Global]['$$proposalsEips']! })
				.where(({ $$proposalsEips }) => (
					eq(
						$$proposalsEips[EntityMetaKey.ParentIdKey],
						globalParentKey,
					)
				))
				.where(({ $$proposalsEips }) => (
					eq(
						$$proposalsEips[EntityMetaKey.Source],
						Source.Eips,
					)
				))
				.select(({ $$proposalsEips }) => ({
					[EntityMetaKey.Id]: $$proposalsEips[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)

	const ercQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$proposalsErc: entityFieldCollections[EntityType._Global]['$$proposalsErc']! })
				.where(({ $$proposalsErc }) => (
					eq(
						$$proposalsErc[EntityMetaKey.ParentIdKey],
						globalParentKey,
					)
				))
				.where(({ $$proposalsErc }) => (
					eq(
						$$proposalsErc[EntityMetaKey.Source],
						Source.Eips,
					)
				))
				.select(({ $$proposalsErc }) => ({
					[EntityMetaKey.Id]: $$proposalsErc[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)

	const ensipQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$proposalsEnsip: entityFieldCollections[EntityType._Global]['$$proposalsEnsip']! })
				.where(({ $$proposalsEnsip }) => (
					eq(
						$$proposalsEnsip[EntityMetaKey.ParentIdKey],
						globalParentKey,
					)
				))
				.where(({ $$proposalsEnsip }) => (
					eq(
						$$proposalsEnsip[EntityMetaKey.Source],
						Source.Ensips,
					)
				))
				.select(({ $$proposalsEnsip }) => ({
					[EntityMetaKey.Id]: $$proposalsEnsip[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)

	const caipsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$caips: entityFieldCollections[EntityType._Global]['$$caips']! })
				.where(({ $$caips }) => (
					eq(
						$$caips[EntityMetaKey.ParentIdKey],
						globalParentKey,
					)
				))
				.where(({ $$caips }) => (
					eq(
						$$caips[EntityMetaKey.Source],
						Source.Caips,
					)
				))
				.select(({ $$caips }) => ({
					[EntityMetaKey.Id]: $$caips[EntityMetaKey.Value][EntityMetaKey.Id],
				}))
		),
		[],
	)


	// (Derived)
	const catalogsPending = $derived(
		eipsQuery.isLoading
		|| ercQuery.isLoading
		|| ensipQuery.isLoading
		|| caipsQuery.isLoading,
	)
	const hasAnyRows = $derived(
		!!(eipsQuery.data?.length)
		|| !!(ercQuery.data?.length)
		|| !!(ensipQuery.data?.length)
		|| !!(caipsQuery.data?.length),
	)
	const anyCatalogError = $derived(
		eipsQuery.isError
		|| ercQuery.isError
		|| ensipQuery.isError
		|| caipsQuery.isError,
	)
	const catalogsQuery = $derived(
		(
			anyCatalogError && !hasAnyRows ?
				{
					data: null,
					isLoading: false,
					isError: true,
					error: new Error('Failed to load proposal catalogs.'),
				}
			:
				{
					data: { catalogsReady: true },
					isLoading: catalogsPending && !hasAnyRows,
					isError: false,
					error: undefined,
				}
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
	import CaipView from '$/views/CaipView.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Proposal}
	{id}
	{href}
	{title}
	bind:open
	{...EntitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			query={catalogsQuery}
			placeholderText="Loading proposal catalogs…"
		>

			{#snippet children(gate)}
				{#if gate?.catalogsReady}
					<div data-column>
						<section>
							<p data-heading>
								EIPs
							</p>
							<QueryBoundary query={eipsQuery}>
								{#snippet Failed(_error, _retry)}
									<p data-text="muted">
										Failed to load EIP proposals.
									</p>
								{/snippet}

								{#snippet children(eipCatalogRows)}
									<UnorderedList
										items={new SvelteSet(eipCatalogRows ?? [])}
										getKey={proposalCatalogRowKey}
										getSortValue={proposalCatalogRowKey}
										placeholderKeys={new SvelteSet()}
										data-column
									>
										{#snippet Item({ item: proposalCatalogRow, isPlaceholder })}
											{#if isPlaceholder}
												<span data-placeholder>
													…
												</span>
											{:else if proposalCatalogRow}
												{@const proposalIdWire = rowEntityId(proposalCatalogRow)}
												{@const proposalEntityId = proposalEntityIdOrNull(proposalIdWire)}
												{#if proposalEntityId != null}
													<ProposalView
														entityId={proposalEntityId}
														href={proposalHref(proposalIdWire)}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{:else}
													<span data-text="muted">
														Proposal
													</span>
												{/if}
											{/if}
										{/snippet}

										{#snippet Empty()}
											<p data-text="muted">
												No EIP proposals in collections.
											</p>
										{/snippet}
									</UnorderedList>
								{/snippet}
							</QueryBoundary>
						</section>

						<section>
							<p data-heading>
								ERCs
							</p>
							<QueryBoundary query={ercQuery}>
								{#snippet Failed(_error, _retry)}
									<p data-text="muted">
										Failed to load ERC proposals.
									</p>
								{/snippet}

								{#snippet children(ercCatalogRows)}
									<UnorderedList
										items={new SvelteSet(ercCatalogRows ?? [])}
										getKey={proposalCatalogRowKey}
										getSortValue={proposalCatalogRowKey}
										placeholderKeys={new SvelteSet()}
										data-column
									>
										{#snippet Item({ item: proposalCatalogRow, isPlaceholder })}
											{#if isPlaceholder}
												<span data-placeholder>
													…
												</span>
											{:else if proposalCatalogRow}
												{@const proposalIdWire = rowEntityId(proposalCatalogRow)}
												{@const proposalEntityId = proposalEntityIdOrNull(proposalIdWire)}
												{#if proposalEntityId != null}
													<ProposalView
														entityId={proposalEntityId}
														href={proposalHref(proposalIdWire)}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{:else}
													<span data-text="muted">
														Proposal
													</span>
												{/if}
											{/if}
										{/snippet}

										{#snippet Empty()}
											<p data-text="muted">
												No ERC proposals in collections.
											</p>
										{/snippet}
									</UnorderedList>
								{/snippet}
							</QueryBoundary>
						</section>

						<section>
							<p data-heading>
								ENSIPs
							</p>
							<QueryBoundary query={ensipQuery}>
								{#snippet Failed(_error, _retry)}
									<p data-text="muted">
										Failed to load ENSIP proposals.
									</p>
								{/snippet}

								{#snippet children(ensipCatalogRows)}
									<UnorderedList
										items={new SvelteSet(ensipCatalogRows ?? [])}
										getKey={proposalCatalogRowKey}
										getSortValue={proposalCatalogRowKey}
										placeholderKeys={new SvelteSet()}
										data-column
									>
										{#snippet Item({ item: proposalCatalogRow, isPlaceholder })}
											{#if isPlaceholder}
												<span data-placeholder>
													…
												</span>
											{:else if proposalCatalogRow}
												{@const proposalIdWire = rowEntityId(proposalCatalogRow)}
												{@const proposalEntityId = proposalEntityIdOrNull(proposalIdWire)}
												{#if proposalEntityId != null}
													<ProposalView
														entityId={proposalEntityId}
														href={proposalHref(proposalIdWire)}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{:else}
													<span data-text="muted">
														Proposal
													</span>
												{/if}
											{/if}
										{/snippet}

										{#snippet Empty()}
											<p data-text="muted">
												No ENSIP proposals in collections.
											</p>
										{/snippet}
									</UnorderedList>
								{/snippet}
							</QueryBoundary>
						</section>

						<section>
							<p data-heading>
								CAIPs
							</p>
							<QueryBoundary query={caipsQuery}>
								{#snippet Failed(_error, _retry)}
									<p data-text="muted">
										Failed to load CAIPs.
									</p>
								{/snippet}

								{#snippet children(caipCatalogRows)}
									<UnorderedList
										items={new SvelteSet(caipCatalogRows ?? [])}
										getKey={proposalCatalogRowKey}
										getSortValue={caipCatalogSortKey}
										placeholderKeys={new SvelteSet()}
										data-column
									>
										{#snippet Item({ item: caipCatalogRow, isPlaceholder })}
											{#if isPlaceholder}
												<span data-placeholder>
													…
												</span>
											{:else if caipCatalogRow}
												{@const caipEntityId = rowEntityId(caipCatalogRow)}
												{#if typeof caipEntityId === 'object' && caipEntityId != null && 'id' in caipEntityId && typeof caipEntityId.id === 'string' && caipEntityId.id.length}
													<CaipView
														entityId={{ id: caipEntityId.id }}
														href={resolve('/(explore)/(proposals)/proposals/caip/[caipId]', {
															caipId: caipEntityId.id,
														})}
														layout={EntityLayout.Summary}
														open={false}
													/>
												{/if}
											{/if}
										{/snippet}

										{#snippet Empty()}
											<p data-text="muted">
												No CAIPs in collections.
											</p>
										{/snippet}
									</UnorderedList>
								{/snippet}
							</QueryBoundary>
						</section>
					</div>
				{/if}
			{/snippet}
		</QueryBoundary>
	{/snippet}
</EntitiesList>
