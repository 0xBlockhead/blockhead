<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.NearNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NearNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const nearNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			name: true,
			environment: true,
			namespace: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.slug) ?? '')].filter(Boolean).join(' ') || 'near network')
	const viewDomId = $derived('near-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.name) ?? ''), String((pendingEntity.slug) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={nearNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.slug) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.environment) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? ''), String((pendingEntity.slug) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={nearNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.environment) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.slug) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const namespace0 = pendingEntity.namespace}
			{#if namespace0 !== undefined && namespace0 !== null}
				<span data-text="muted">
					{String((namespace0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nearNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const namespace0 = resolvedEntity.namespace}
					{#if namespace0 !== undefined && namespace0 !== null}
						<span data-text="muted">
							{String((namespace0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from declared NEAR sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rpcEndpoints = resolvedEntity.rpcEndpoints}
							{#if rpcEndpoints !== undefined && rpcEndpoints !== null}
								{rpcEndpoints.values.map((value) => String((value.url) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-near-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'near-chain-observations',
							label: 'Observations',
						},
						{
							id: 'near-chain-blocks',
							label: 'Blocks',
						},
					]
				}
				data-card
				class='network-view-collapsible-chain-activity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionNearChainObservations({ id, label, open })}
					<NearNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								sources: [
									Source.NearRpc_JsonRpc,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No observations available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionNearChainBlocks({ id, label, open })}
					<NearBlocksView
						selection={
							selection.$$blocks({
								sources: [
									Source.NearRpc_JsonRpc,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No blocks available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-near-validators'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'near-validator-list',
							label: 'Validators',
						},
					]
				}
				data-card
				class='network-view-collapsible-validators'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Validators</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionNearValidatorList({ id, label, open })}
					<NearValidatorsView
						selection={
							selection.$$validators({
								sources: [
									Source.NearRpc_JsonRpc,
								],
							})
						}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No validators available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
