<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityId, EntitySchemaFieldName } from '$/schema/$schema.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { entityFieldCollections } from '$/data/collections/entityFieldCollections.ts'
	import { sourcesForEntityFieldLiveQuery } from '$/data/tanstackDb/entityQuerySources.ts'
	import { serializeEntityId } from '$/schema/$entityId.ts'
	import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		proposalRealmBySlug,
	} from '$/constants/Proposal/ProposalRealm.ts'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal/ProposalCategory.ts'
	import { inArray, useLiveQuery } from '@tanstack/svelte-db'

	type ProposalCatalogField = Extract<
		EntitySchemaFieldName<EntityType._Global>,
		`$$proposals${string}`
	>

	const proposalCatalogHeadings: Record<ProposalCatalogField, string> = {
		$$proposalsEips: 'EIPs',
		$$proposalsErc: 'ERCs',
		$$proposalsEnsip: 'ENSIPs',
	}

	const proposalCatalogFields: ProposalCatalogField[] = [
		'$$proposalsEips',
		'$$proposalsErc',
		'$$proposalsEnsip',
	]

	const proposalCatalogHeading = (catalogField: ProposalCatalogField) => (
		proposalCatalogHeadings[catalogField]
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


	// (Derived)
	const [
		proposalsEipsFieldName,
		proposalsErcFieldName,
		proposalsEnsipFieldName,
	] = proposalCatalogFields

	const proposalsEipsLiveQuery = useLiveQuery((q) => (
		q
			.from({
				row: entityFieldCollections[EntityType._Global][proposalsEipsFieldName],
			})
			.where(({ row }) =>
				inArray(
					row[entityCollectionRow.source],
					sourcesForEntityFieldLiveQuery(EntityType._Global, proposalsEipsFieldName),
				),
			)
			.select(({ row: proposalRow }) => proposalRow)
	))

	const proposalsErcLiveQuery = useLiveQuery((q) => (
		q
			.from({
				row: entityFieldCollections[EntityType._Global][proposalsErcFieldName],
			})
			.where(({ row }) =>
				inArray(
					row[entityCollectionRow.source],
					sourcesForEntityFieldLiveQuery(EntityType._Global, proposalsErcFieldName),
				),
			)
			.select(({ row: proposalRow }) => proposalRow)
	))

	const proposalsEnsipLiveQuery = useLiveQuery((q) => (
		q
			.from({
				row: entityFieldCollections[EntityType._Global][proposalsEnsipFieldName],
			})
			.where(({ row }) =>
				inArray(
					row[entityCollectionRow.source],
					sourcesForEntityFieldLiveQuery(EntityType._Global, proposalsEnsipFieldName),
				),
			)
			.select(({ row: proposalRow }) => proposalRow)
	))

	const proposalCatalogSections: {
		fieldName: ProposalCatalogField
		liveQuery: typeof proposalsEipsLiveQuery
	}[] = [
		{
			fieldName: proposalsEipsFieldName,
			liveQuery: proposalsEipsLiveQuery,
		},
		{
			fieldName: proposalsErcFieldName,
			liveQuery: proposalsErcLiveQuery,
		},
		{
			fieldName: proposalsEnsipFieldName,
			liveQuery: proposalsEnsipLiveQuery,
		},
	]

	const listLoading = $derived(
		proposalCatalogSections.some((section) => section.liveQuery.isLoading),
	)
	const listError = $derived(
		proposalCatalogSections.some((section) => section.liveQuery.isError),
	)

	const pathId = (id: EntityId<EntityType.Proposal>) => (
		`${proposalCategoryById[id.kind].slug}-${id.number}`
	)

	const label = (id: EntityId<EntityType.Proposal>) => (
		`${proposalCategoryById[id.kind].label}-${id.number}`
	)

	const proposalIdFromRow = (proposalRow: object) => {
		const rowRecord = proposalRow as Record<string, unknown>
		const proposalId = (
			typeof rowRecord.$id === 'object' &&
			rowRecord.$id != null &&
			!Array.isArray(rowRecord.$id) ?
				rowRecord.$id
			:	proposalRow
		) as Record<string, unknown>
		const kind = proposalId.kind
		const number = proposalId.number
		const realm = proposalRealmBySlug[String(proposalId.realm)]?.id
		return (
			realm != null &&
			(kind === ProposalCategory.Eip || kind === ProposalCategory.Erc || kind === ProposalCategory.Ensip) &&
			typeof number === 'number' ?
				{
					realm,
					kind,
					number,
				}
			:	null
		)
	}

	const proposalRowKey = (
		proposalRow: object,
		proposalIndex: number,
	) => {
		const rowRecord = proposalRow as Record<string, unknown>
		const src = rowRecord[entityCollectionRow.source]
		const proposalId = proposalIdFromRow(proposalRow)
		return (
			proposalId ?
				`${String(src ?? '')}\0${serializeEntityId(proposalId)}`
			:	`invalid-proposal-row-${proposalIndex}`
		)
	}


	// Components
	import Boundary from '$/components/Boundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
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
		<Boundary>
			{#snippet Failed(error, _retry)}
				<p role="alert">
					{String(error)}
				</p>
			{/snippet}

			{#if listLoading}
				<p data-text="muted">
					Loading proposals…
				</p>
			{:else if listError}
				<p role="alert">
					Could not load proposals.
				</p>
			{:else}
				<div data-column>
					{#each proposalCatalogSections as { fieldName, liveQuery } (fieldName)}
						{@const rows = liveQuery.data ?? []}
						<section data-column>
							<h3 data-heading>
								{proposalCatalogHeading(fieldName)}
							</h3>
							{#if rows.length === 0}
								<p data-text="muted">
									No entries.
								</p>
							{:else}
								<ul data-list>
									{#each rows as proposalRow, proposalIndex (proposalRowKey(proposalRow, proposalIndex))}
										{@const proposalId = proposalIdFromRow(proposalRow)}
										{#if proposalId}
											<li>
												<a
													href={resolve(
														'/(explore)/(proposals)/proposal/[proposalRealmId]/[proposalId]',
														{
															proposalRealmId: proposalId.realm,
															proposalId: pathId(proposalId),
														},
													)}
												>
													{label(proposalId)}
												</a>
											</li>
										{/if}
									{/each}
								</ul>
							{/if}
						</section>
					{/each}
				</div>
			{/if}
		</Boundary>
	{/snippet}
</EntitiesList>
