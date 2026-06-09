<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	const realm = useEntity(entityCollectionsContext, EntityType.SpecificationRealm,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, slug: true } }),
	)


	// (Derived)
	const realmRow = $derived(
		realm.ready ?
			realm.current
			:
			undefined,
	)

	const href = $derived(
		hrefProp ?? (
			realmRow?.fields.slug != null ?
				resolve(
					'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
					{
						specificationRealmSlug: realmRow.fields.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
	{entityId}
	{href}
	title={realmRow?.fields.label ?? String(entityId.realm)}
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
					{realm.fields.slug ?? String(entityId.realm)}
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
				{realm.fields.label ?? String(entityId.realm)}
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
