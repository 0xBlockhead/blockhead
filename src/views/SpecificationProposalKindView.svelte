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

			selector: EntitySelector<typeof schema, EntityType.SpecificationProposalKind>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()

	const kind = $derived(subscribe(EntityType.SpecificationProposalKind,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, labelPlural: true, slug: true } }),
	))

	const specificationRealm = $derived(subscribe(EntityType.SpecificationRealm,
		{
			realm: selector.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true } }),
	))


	// (Derived)
	const kindRow = $derived(
		kind.ready ?
			kind.current
			:
			undefined,
	)

	const specificationRealmRow = $derived(
		specificationRealm.ready ?
			specificationRealm.current
			:
			undefined,
	)

	const href = $derived(
		hrefProp ?? (
			kindRow?.fields.slug != null && specificationRealmRow?.fields.slug != null ?
				resolve(
					'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
					{
						specificationRealmSlug: specificationRealmRow.fields.slug,
						proposalKindSlug: kindRow.fields.slug,
					},
				)
			: specificationRealmRow?.fields.slug != null ?
				resolve(
					'/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
					{
						specificationRealmSlug: specificationRealmRow.fields.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selector}
	{href}
	title={kindRow?.fields.labelPlural ?? kindRow?.fields.label ?? `${selector.category}`}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(kind)}
				<span>
					{kind.fields.label ?? selector.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(kind)}
				<span>
					{kind.fields.labelPlural ?? kind.fields.label ?? selector.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if (
				open
				&& kindRow?.fields.labelPlural !== undefined
			)}
				<div>
					<dt>Label plural</dt>
					<dd>
						<ResourceBoundary
							resource={kind}
							placeholderText="Loading proposal kind…"
						>
							{#snippet children(kind)}
								{kind.fields.labelPlural}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposals…"
		>
			{#snippet children(kind)}
				<ProposalsView
					href={resolve('/proposals')}
					entityFieldReference={{
						entityType: EntityType.SpecificationProposalKind,
						selector,
						fieldName: '$$proposals',
					}}
					filterCategory={selector.category}
					filterRealm={selector.realm}
					id={`${stringify(selector)}:proposals`}
					open
					title={
						kind.fields.labelPlural
						?? kind.fields.label
						?? 'Proposals'
					}
				/>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
