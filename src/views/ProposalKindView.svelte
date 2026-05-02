<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import {
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalKindSchema from '$/schema/ProposalKind.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		children?: Snippet
		entityId: typeof ProposalKindSchema.id.infer
		open?: boolean
		href: string
		layout?: EntityLayout
	} = $props()


	const kindIdKey = $derived(
		stringify(entityId),
	)

	const kindQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ kindRow: entityCollectionByEntityType[EntityType.ProposalKind] })
				.where(({ kindRow }) => (
					eq(
						kindRow[EntityMetaKey.IdKey],
						kindIdKey,
					)
				))
				.select(({ kindRow }) => ({ kindRow }))
		),
		[() => kindIdKey],
	)

	const kindRow = $derived(
		kindQuery.data?.[0]?.kindRow,
	)

	const kindLabelPlural = $derived(
		(
			kindRow?.[EntityMetaKey.Fields] as { labelPlural?: string } | undefined
		)?.labelPlural
		?? proposalCategoryById[entityId.category].labelPlural,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalKind}
	{entityId}
	{href}
	title={kindLabelPlural}
	{layout}
	{open}
>
	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ProposalKind}
			{entityId}
		>
			<QueryBoundary query={kindQuery}>
				{#snippet children(_rows)}
					<ProposalsView
						entityFieldReference={{
							entityType: EntityType.ProposalKind,
							entityId,
							fieldName: '$$proposals',
						}}
						href={href}
						id={`${kindIdKey}:proposals`}
						open={false}
						title={kindLabelPlural}
					/>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
