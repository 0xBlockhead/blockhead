<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { proposalRealmById } from '$/constants/Proposal.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalRealmSchema from '$/schema/ProposalRealm.ts'


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
		entityId: typeof ProposalRealmSchema.id.infer
		open?: boolean
		href: string
		layout?: EntityLayout
	} = $props()


	const realmIdKey = $derived(
		stringify(entityId),
	)

	const realmQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ realmRow: entityCollectionByEntityType[EntityType.ProposalRealm] })
				.where(({ realmRow }) => (
					eq(
						realmRow[EntityMetaKey.IdKey],
						realmIdKey,
					)
				))
				.select(({ realmRow }) => ({ realmRow }))
		),
		[() => realmIdKey],
	)

	const realmRow = $derived(
		realmQuery.data?.[0]?.realmRow,
	)

	const realmLabel = $derived(
		(
			realmRow?.[EntityMetaKey.Fields] as { label?: string } | undefined
		)?.label
		?? proposalRealmById[entityId.realm].label,
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalRealm}
	{entityId}
	{href}
	title={realmLabel}
	{layout}
	{open}
>
	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ProposalRealm}
			{entityId}
		>
			<QueryBoundary query={realmQuery}>
				{#snippet children(_rows)}
					<ProposalKindsView
						entityFieldReference={{
							entityType: EntityType.ProposalRealm,
							entityId,
							fieldName: '$$proposalKinds',
						}}
						href={href}
						id={`${realmIdKey}:proposalKinds`}
						open={false}
						title="Kinds"
					/>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

