<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'

	import { proposalRealmById } from '$/constants/Proposal.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const realm = useEntity(
		EntityType.ProposalRealm,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			...(open && {
				label: {},
				slug: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={realm}
			placeholderText="Loading realm…"
		>
			{#snippet children(r)}
				<dl data-column-item="center">
					<div>
						<dt>Realm</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>
					{#if open}
						{#if r.slug != null && r.slug !== ''}
							<div>
								<dt>Slug</dt>
								<dd>{r.slug}</dd>
							</div>
						{/if}
					{/if}

					{#if open && (r.slug == null || r.slug === '')}
						<div>
							<dt>Metadata</dt>
							<dd data-text="muted">No realm metadata available.</dd>
						</div>
					{/if}
				</dl>
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
			title="Proposal kinds"
		/>
		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
