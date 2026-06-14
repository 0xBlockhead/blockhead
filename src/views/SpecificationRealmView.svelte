<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{

			selector: EntitySelector<typeof schema, EntityType.SpecificationRealm>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()

	const realm = subscribe(EntityType.SpecificationRealm,
		selector,
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
	entitySelector={selector}
	{href}
	title={realmRow?.fields.label ?? String(selector.realm)}
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
					{realm.fields.slug ?? String(selector.realm)}
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
				{realm.fields.label ?? String(selector.realm)}
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
				selector,
				fieldName: '$$proposalKinds',
			}}
			id={`${stringify(selector)}:proposalKinds`}
			open={false}
			title="Proposal kinds"
		/>
	{/snippet}
</EntityView>
