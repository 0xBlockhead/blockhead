<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntitiesListLayout } from '$/components/EntitiesListLayout.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import {
		proposalCategoryById,
		proposalRealmById,
		proposalWireParts,
	} from '$/constants/Proposal.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		title = 'Proposals',

		open = $bindable(true),
		entityFieldReference,

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, typeof EntityType.Proposal>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const proposalsQuery = useLiveQuery(
		(queryBuilder) => {
			const parentIdKey = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({
						$$proposals: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName]!,
					})
					.where(({ $$proposals }) => (
						eq(
							$$proposals[EntityMetaKey.ParentIdKey],
							parentIdKey,
						)
					))
					.select(({ $$proposals }) => ({
						proposalRow: $$proposals,
					}))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type ProposalRow = {
		proposalRow: {
			[EntityMetaKey.Value]: {
				[EntityMetaKey.Id]: unknown
			}
		}
	}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalView from '$/views/ProposalView.svelte'
</script>


<EntitiesList
	entityType={EntityType.Proposal}
	{title}
	bind:open
	query={proposalsQuery}
	items={new SvelteSet(proposalsQuery.data ?? [])}
	getKey={(row) => stringify(
		(row as ProposalRow).proposalRow[EntityMetaKey.Value][EntityMetaKey.Id],
	)}
	getSortValue={(row) => (
		proposalWireParts(
			(row as ProposalRow).proposalRow[EntityMetaKey.Value][EntityMetaKey.Id],
		)?.number ?? Number.POSITIVE_INFINITY
	)}
	layout={EntitiesListLayout.Carousel}
	panelStyle="--carousel-basis: min(40ch, 88cqi); gap: 0.5em"
	placeholderKeys={new SvelteSet<string | number>()}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No proposals to show yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const proposalId = proposalWireParts(
				(row as ProposalRow).proposalRow[EntityMetaKey.Value][EntityMetaKey.Id],
			)}
			{#if proposalId != null}
				{@const proposalEntityId = proposalId}
				<ProposalView
					entityId={proposalEntityId}
					href={resolve(
						(
							`/proposals/${proposalRealmById[proposalEntityId.realm].slug}/${proposalCategoryById[proposalEntityId.category].slug}/${proposalCategoryById[proposalEntityId.category].slug}-${proposalEntityId.number}` as string
						),
					)}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
