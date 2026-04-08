<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal/ProposalCategory.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Proposal>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const proposalIdKey = $derived(
		stringify(entityId),
	)

	const kindLabel = $derived(
		proposalCategoryById[entityId.category]?.label ?? 'Proposal',
	)

	const proposalQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Proposal] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						proposalIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => proposalIdKey],
	)

	const proposalRow = $derived(
		(
			proposalQuery.data?.find(
				({ row }) => row[EntityMetaKey.Source] === (
					entityId.category === ProposalCategory.Ensip ?
						Source.Ensips
					:
						Source.Eips
				),
			)?.row
			?? proposalQuery.data?.[0]?.row
		),
	)

	const proposalCategoryStr = $derived(
		(() => {
			const bag = proposalRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object' || !('category' in bag)) return null
			const c = (bag as { category: unknown }).category
			return typeof c === 'string' ? c : null
		})(),
	)

	const bodyText = $derived(
		(() => {
			const bag = proposalRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object' || !('body' in bag)) return null
			const v = (bag as { body: unknown }).body
			return typeof v === 'string' ? v : null
		})(),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	title={`${kindLabel} ${entityId.number}`}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Realm</dt>
				<dd>{entityId.realm}</dd>
			</div>
			<div>
				<dt>Category</dt>
				<dd>{entityId.category}</dd>
			</div>
			{#if proposalCategoryStr != null}
				<div>
					<dt>Frontmatter</dt>
					<dd>{proposalCategoryStr}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Proposal}
			{entityId}
		>
			<QueryBoundary
				query={proposalQuery}
			>

				{#snippet children(proposalRows)}
					{@const proposalRow = (
						proposalRows?.find(
							({ row }) => row[EntityMetaKey.Source] === (
								entityId.category === ProposalCategory.Ensip ?
									Source.Ensips
								:
									Source.Eips
							),
						)?.row
						?? proposalRows?.[0]?.row
					)}
					{@const bodyText = (() => {
						const bag = proposalRow?.[EntityMetaKey.Fields]
						if (bag == null || typeof bag !== 'object' || !('body' in bag)) return null
						const v = (bag as { body: unknown }).body
						return typeof v === 'string' ? v : null
					})()}
					{#if bodyText == null}
						<p data-text="muted">
							No body in collections yet (resolve EIPs / ENSIPs for this proposal).
						</p>
					{:else}
						<article
							data-proposal-body
						>
							{bodyText}
						</article>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<ProposalsView
			href={resolve('/proposals')}
			id={`${proposalIdKey}:proposals`}
			open={false}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	article[data-proposal-body] {
		white-space: pre-wrap;
		font-size: 0.9em;
	}
</style>
