<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import {
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.ProposalKind>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'title'
			| 'open'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const kind = useEntity(
		EntityType.ProposalKind,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			labelPlural: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalKind}
	{entityId}
	{href}
	title={proposalCategoryById[entityId.category].labelPlural}
	{layout}
	{open}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposals…"
		>
			{#snippet children(k)}
				<dl>
					<div>
						<dt>Category</dt>
						<dd>{proposalCategoryById[entityId.category].labelPlural}</dd>
					</div>
					{#if open}
						{#if k.labelPlural !== undefined}
							<div>
								<dt>Label plural</dt>
								<dd>{k.labelPlural}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.ProposalKind}
			{entityId}
		/>
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposals…"
		>
			{#snippet children(k)}
				<ProposalsView
					entityFieldReference={{
						entityType: EntityType.ProposalKind,
						entityId,
						fieldName: '$$proposals',
					}}
					{href}
					id={`${stringify(entityId)}:proposals`}
					open={false}
					title={
						k.labelPlural
						?? proposalCategoryById[entityId.category].labelPlural
					}
				/>
			{/snippet}
		</ResourceBoundary>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
