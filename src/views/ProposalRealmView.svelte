<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'

	import { proposalRealmById } from '$/constants/Proposal.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


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
			entityId: EntityId<typeof schema, EntityType.ProposalRealm>
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
			| 'layout'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalRealm}
	{entityId}
	{href}
	title={proposalRealmById[entityId.realm].label}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{proposalRealmById[entityId.realm].slug}
		</span>
	{/snippet}

	{#snippet Heading()}
		{proposalRealmById[entityId.realm].label}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.ProposalRealm}
			{entityId}
		/>

		<ProposalKindsView
			entityFieldReference={{
				entityType: EntityType.ProposalRealm,
				entityId,
				fieldName: '$$proposalKinds',
			}}
			{href}
			id={`${stringify(entityId)}:proposalKinds`}
			open={false}
			title="Proposal kinds"
		/>
		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
