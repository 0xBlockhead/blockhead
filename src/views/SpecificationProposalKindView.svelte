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

			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposalKind>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	const kind = $derived(selection(
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true, labelPlural: true, slug: true } }),
	))

	const specificationRealm = $derived(select(EntityType.SpecificationRealm,
		{
			realm: selection.entitySelector.realm,
		},
		({ sources: [
				Source.Constants_Internal,
			], fields: { slug: true } }),
	))

	const href = $derived(
		hrefProp ?? resolve('/proposals'),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposalKind}
	entitySelector={selection.entitySelector}
	{href}
	title={`${selection.entitySelector.category}`}
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
					{kind.fields.label ?? selection.entitySelector.category}
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
					{kind.fields.labelPlural ?? kind.fields.label ?? selection.entitySelector.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Label plural</dt>
					<dd>
						<ResourceBoundary
							resource={kind}
							placeholderText="Loading proposal kind…"
						>
							{#snippet children(kind)}
								{#if kind.fields.labelPlural !== undefined}
									{kind.fields.labelPlural}
								{/if}
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
					selection={selection.$$proposals}
					filterCategory={selection.entitySelector.category}
					filterRealm={selection.entitySelector.realm}
					id={`${stringify(selection.entitySelector)}:proposals`}
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
