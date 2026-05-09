<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import {
		proposalCategoryById,
	} from '$/constants/Proposal.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.ProposalKind>
		open?: boolean
		href: string
		layout?: EntityLayout
	} = $props()


	const kindIdKey = $derived(
		stringify(entityId),
	)

	const kindQuery = useEntity(
		EntityType.ProposalKind,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			labelPlural: {},
		},
	)

	const kindLabelPlural = $derived.by(() => {
		return kindQuery.data?.[EntityMetaKey.Fields]?.labelPlural ?? proposalCategoryById[entityId.category].labelPlural
	})


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
