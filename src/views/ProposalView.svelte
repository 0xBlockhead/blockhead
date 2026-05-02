<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import {
		ProposalCategory,
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import ProposalSchema from '$/schema/Proposal.ts'
	import { Source } from '$/sources/$Source.ts'

	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'


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
			entityId: typeof ProposalSchema.id.infer
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
		>
	> = $props()

	// (Derived)
	const rowQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.Proposal] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						stringify(entityId),
					)
				))
				.select(({ row }) => ({ row }))
		),
		[
			() => stringify(entityId),
		],
	)

	const fieldsBag = $derived(
		(() => {
			const row = (
				rowQuery.data?.find(
					({ row }) => row[EntityMetaKey.Source] === (
						entityId.category === ProposalCategory.Caip ?
							Source.Caips_Github
						:	entityId.category === ProposalCategory.Ensip ?
								Source.Ensips_Github
							:
								Source.EthereumEips_Github
					),
				)?.row
				?? rowQuery.data?.[0]?.row
			)
			const fields = row?.[EntityMetaKey.Fields]
			return fields != null && typeof fields === 'object' ? fields : null
		})(),
	)

	type ProposalFields = {
		documentBody?: unknown
		documentStatus?: unknown
		documentTitle?: unknown
	}

	const proposalFields = $derived(
		fieldsBag as ProposalFields | null,
	)

	const headingTitle = $derived(
		(() => {
			const identifier = `${proposalCategoryById[entityId.category].label}-${entityId.number}`
			const core = (
				String(proposalFields?.documentTitle ?? '').trim() !== '' ?
					String(proposalFields?.documentTitle).trim()
				:	entityId.category === ProposalCategory.Ensip ?
						String(proposalFields?.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						?? null
					:	null
			)
			const title = String(core ?? '').trim()
			return (
				title === '' ?
					identifier
				:	new RegExp(
						`^${identifier.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:`,
						'i',
					).test(title) ?
						title
					:	`${identifier.trim()}: ${title}`
			)
		})(),
	)
</script>


<EntityView
	entityType={EntityType.Proposal}
	{entityId}
	title={headingTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			{#if proposalFields?.documentStatus}
				<div>
					<dt>Status</dt>
					<dd>{proposalFields.documentStatus}</dd>
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
				query={rowQuery}
			>
				{#snippet children(rows)}
					{@const detailRow = (
						rows?.find(
							({ row }) => row[EntityMetaKey.Source] === (
								entityId.category === ProposalCategory.Caip ?
									Source.Caips_Github
								:	entityId.category === ProposalCategory.Ensip ?
										Source.Ensips_Github
									:
										Source.EthereumEips_Github
							),
						)?.row
						?? rows?.[0]?.row
					)}
					{#if detailRow === undefined}
						<p data-text="muted">
							No proposal data for this item yet. Try again shortly.
						</p>
					{:else}
						{@const detailFields = (
							detailRow[EntityMetaKey.Fields] != null && typeof detailRow[EntityMetaKey.Fields] === 'object' ?
								(detailRow[EntityMetaKey.Fields] as ProposalFields)
							:
								null
						)}
						{#if detailFields?.documentBody}
							<Markdown content={String(detailFields.documentBody)} />
						{:else}
							<p data-text="muted">
								No document body yet.
							</p>
						{/if}
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
