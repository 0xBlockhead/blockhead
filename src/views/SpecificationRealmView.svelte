<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href: hrefProp,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{

			selection: EntityProxyResource<typeof schema, EntityType.SpecificationRealm>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	const realm = $derived(selection( { sources: [
				Source.Constants_Internal,
			], fields: { label: true, slug: true } }))

	const href = $derived(
		hrefProp ?? resolve('/proposals'),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalKindsView from '$/views/SpecificationProposalKindsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationRealm}
	entitySelector={selection.entitySelector}
	{href}
	title={String(selection.entitySelector.realm)}
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
					{realm.slug ?? String(selection.entitySelector.realm)}
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
				{realm.label ?? String(selection.entitySelector.realm)}
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
			selection={selection.$$proposalKinds({
				sources: [
					Source.Constants_Internal,
				],
			})}
			id={`${stringify(selection.entitySelector)}:proposalKinds`}

			title="Proposal kinds"
		/>
	{/snippet}
</EntityView>
