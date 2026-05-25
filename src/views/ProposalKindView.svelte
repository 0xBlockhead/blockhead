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

			entityId: EntityId<typeof schema, EntityType.ProposalKind>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const kind = useEntity(
		EntityType.ProposalKind,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			label: {},
			labelPlural: {},
			slug: {},
		},
	)

	const proposalRealm = useEntity(
		EntityType.ProposalRealm,
		{
			realm: entityId.realm,
		},
		{
			$: [
				Source.Constants_Internal,
			],
			slug: {},
		},
	)


	const href = $derived(
		hrefProp ?? (
			kind.slug != null && proposalRealm.slug != null ?
				resolve(
					'/proposals/[proposalRealmSlug]/[proposalKindSlug]',
					{
						proposalRealmSlug: proposalRealm.slug,
						proposalKindSlug: loadedKind.slug,
					},
				)
			: proposalRealm.slug != null ?
				resolve(
					'/proposals/[proposalRealmSlug]',
					{
						proposalRealmSlug: proposalRealm.slug,
					},
				)
			:
				resolve('/proposals')
		),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalKind}
	{entityId}
	{href}
	title={kind.labelPlural ?? kind.label ?? `${entityId.category}`}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(loadedKind)}
				<span>
					{loadedKind.label ?? entityId.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(loadedKind)}
				<span>
					{loadedKind.labelPlural ?? loadedKind.label ?? entityId.category}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposal kind…"
		>
			{#snippet children(loadedKind)}
				{loadedKind.labelPlural ?? loadedKind.label ?? entityId.category}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if (
				open
				&& kind.labelPlural !== undefined
			)}
				<div>
					<dt>Label plural</dt>
					<dd>
						<ResourceBoundary
							resource={kind}
							placeholderText="Loading proposal kind…"
						>
							{#snippet children(loadedKind)}
								{loadedKind.labelPlural}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.ProposalKind}
			{entityId}
		/>
		<ResourceBoundary
			resource={kind}
			placeholderText="Loading proposals…"
		>
			{#snippet children(loadedKind)}
				<ProposalsView
					href={resolve('/proposals')}
					entityFieldReference={{
						entityType: EntityType.ProposalKind,
						entityId,
						fieldName: '$$proposals',
					}}
					id={`${stringify(entityId)}:proposals`}
					open={false}
					title={
						loadedKind.labelPlural
						?? loadedKind.label
						?? 'Proposals'
					}
				/>
			{/snippet}
		</ResourceBoundary>

	{/snippet}
</EntityView>
