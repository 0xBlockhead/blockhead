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

			entityId: EntityId<typeof schema, EntityType.SpecificationRealm>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const realm = useEntity(
		EntityType.SpecificationRealm,
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
					'/proposals/[specificationRealmSlug]',
					{
						specificationRealmSlug: realm.slug,
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
	import ProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
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
			placeholderText="Loading specification realm…"
		>
			{#snippet children(realm)}
				<span>
					{realm.slug ?? String(entityId.realm)}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={realm}
			placeholderText="Loading specification realm…"
		>
			{#snippet children(realm)}
				{realm.label ?? String(entityId.realm)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A realm gathers related specification families so you browse documents by steward and topic—not by vote totals.
		</p>
	{/snippet}

	{#snippet Details({ open })}
		<ProposalKindsView
			{href}
			entityFieldReference={{
				entityType: EntityType.SpecificationRealm,
				entityId,
				fieldName: '$$proposalKinds',
			}}
			id={`${stringify(entityId)}:proposalKinds`}
			open={false}
			title="Proposal kinds"
		/>
	{/snippet}
</EntityView>
