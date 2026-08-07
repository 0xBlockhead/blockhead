<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TallyGovernor> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Tally,
		],
	}))
	const tallyGovernor = $derived(viewSelection({
		fields: {
			name: true,
			organizationName: true,
			governorType: true,
			slug: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), (prefetched.organizationName ?? '')].filter(Boolean).join(' ') || selection.entitySelector.governorId || 'Tally governor')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TallyProposalsView from '$/views/TallyProposalsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TallyGovernor}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/tally/governor/[governorId=stringSegment]',
				{
					governorId: encodeURIComponent(selection.entitySelector.governorId),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tallyGovernor}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), (entity.organizationName ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={tallyGovernor}>
			{#snippet children(entity)}
				{[(entity.governorType ?? ''), (entity.slug ?? '')].filter(Boolean).join(' ') || [(entity.name ?? ''), (entity.organizationName ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
						prefetched={network}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Governor contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$contract}
					>
						{#snippet children(evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
								prefetched={evmContract}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={tallyGovernor}
			>
				{#snippet children(entity)}
					{@const governorType = entity.governorType}
					{#if governorType != null}
						<div>
							<dt>Governor type</dt>
							<dd>
								{governorType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							kind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const kind = entity.kind}
					{#if kind != null}
						<div>
							<dt>Kind</dt>
							<dd>
								{kind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tallyGovernor}
			>
				{#snippet children(entity)}
					{@const slug = entity.slug}
					{#if slug != null}
						<div>
							<dt>Slug</dt>
							<dd>
								{slug}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={tallyGovernor}
			>
				{#snippet children(entity)}
					{@const organizationName = entity.organizationName}
					{#if organizationName != null}
						<div>
							<dt>Organization</dt>
							<dd>
								{organizationName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							organizationSlug: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const organizationSlug = entity.organizationSlug}
					{#if organizationSlug != null}
						<div>
							<dt>Organization slug</dt>
							<dd>
								{organizationSlug}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							organizationId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const organizationId = entity.organizationId}
					{#if organizationId != null}
						<div>
							<dt>Organization ID</dt>
							<dd>
								{organizationId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quorum: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quorum = entity.quorum}
					{#if quorum != null}
						<div>
							<dt>Quorum</dt>
							<dd>
								{quorum}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegatesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatesCount = entity.delegatesCount}
					{#if delegatesCount != null}
						<div>
							<dt>Delegates</dt>
							<dd>
								{delegatesCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isPrimary: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isPrimary = entity.isPrimary}
					{#if isPrimary != null}
						<div>
							<dt>Primary</dt>
							<dd>
								{isPrimary ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Governor ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.governorId} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								description: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const description = entity.description}
						{#if description != null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{description}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const proposalsResource = selection.$$proposals}
		<ResourceBoundary
			resource={proposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<TallyProposalsView
						selection={proposalsResource}
						countResource={proposalsResource.count}
						title='Proposals'
						href={
							resolve(
								'/tally/governor/[governorId=stringSegment]/(tallyGovernor)/proposals',
								{
									governorId: encodeURIComponent(selection.entitySelector.governorId),
								}
							)
						}
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
