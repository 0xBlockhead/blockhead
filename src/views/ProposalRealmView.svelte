<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { proposalRealmById } from '$/constants/Proposal.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'


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
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	const realm = useEntity(
		EntityType.ProposalRealm,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			label: {},
			slug: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.ProposalRealm}
	{entityId}
	{href}
	title={proposalRealmById[entityId.realm].label}
	{layout}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<ResourceBoundary resource={realm}>
			{#snippet children(r)}
				{#if open}
					{#if r.slug != null}
						{#if r.slug !== ''}
							<dl>
								<div>
									<dt>Slug</dt>
									<dd>{r.slug}</dd>
								</div>
							</dl>
						{/if}
					{/if}
					{#if r.slug == null}
						<p data-text="muted">No realm metadata available.</p>
					{/if}
					{#if r.slug != null}
						{#if r.slug === ''}
							<p data-text="muted">No realm metadata available.</p>
						{/if}
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
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
			title="Kinds"
		/>
		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
