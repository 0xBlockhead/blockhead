<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{

			entityId: EntityId<typeof schema, EntityType.ProposalRealm>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
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
			label: {},
			slug: {},
		},
	)


	const href = $derived(
		hrefProp ?? (
			realm.slug != null ?
				resolve(
					'/proposals/[proposalRealmSlug]',
					{
						proposalRealmSlug: loadedRealm.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalRealm}
	{entityId}
	{href}
	title={realm.label ?? String(entityId.realm)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={realm}
			placeholderText="Loading proposal realm…"
		>
			{#snippet children(loadedRealm)}
				<span>
					{loadedRealm.slug ?? String(entityId.realm)}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={realm}
			placeholderText="Loading proposal realm…"
		>
			{#snippet children(loadedRealm)}
				{loadedRealm.label ?? String(entityId.realm)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.ProposalRealm}
			{entityId}
		/>
		<ProposalKindsView
			{href}
			entityFieldReference={{
				entityType: EntityType.ProposalRealm,
				entityId,
				fieldName: '$$proposalKinds',
			}}
			id={`${stringify(entityId)}:proposalKinds`}
			open={false}
			title="Proposal kinds"
		/>
	{/snippet}
</EntityView>
