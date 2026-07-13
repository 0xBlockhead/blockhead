<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmProtocol>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmProtocol>>
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
	const evmProtocol = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			registryName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.protocolName) ?? '')].filter(Boolean).join(' ') || 'EVM protocol')
	const viewDomId = $derived('evm-protocol-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmProtocol}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? resolve('/evm')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmProtocol}>
			{#snippet Pending()}
				{[String((pendingEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmProtocol}>
			{#snippet Pending()}
				{[String((pendingEntity.registryName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || 'EVM protocol'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.registryName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.protocolName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Catalog surface for EVM signature, topic, and error registries.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									protocolName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const protocolName = pendingEntity.protocolName}
							{#if protocolName !== undefined && protocolName !== null}
								{String((protocolName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocolName = resolvedEntity.protocolName}
							{#if protocolName !== undefined && protocolName !== null}
								{String((protocolName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registry name name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									registryName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const registryName = pendingEntity.registryName}
							{#if registryName !== undefined && registryName !== null}
								{String((registryName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const registryName = resolvedEntity.registryName}
							{#if registryName !== undefined && registryName !== null}
								{String((registryName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Connection model</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									relationshipModel: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const relationshipModel = pendingEntity.relationshipModel}
							{#if relationshipModel !== undefined && relationshipModel !== null}
								{String((relationshipModel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const relationshipModel = resolvedEntity.relationshipModel}
							{#if relationshipModel !== undefined && relationshipModel !== null}
								{String((relationshipModel) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									homeUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const homeUrl = pendingEntity.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const homeUrl = resolvedEntity.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							docsUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const docsUrl = pendingEntity.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const docsUrl = resolvedEntity.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-protocol-signatures'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-protocol-selectors',
							label: 'Selectors',
						},
						{
							id: 'evm-protocol-topics',
							label: 'Topics',
						},
					]
				}
				data-card
				class='network-view-collapsible-signatures'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Signatures</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmProtocolSelectors({ id, label, open })}
					<EvmSelectorsView
						selection={
							selection.$$evmSelectors({
								count: true,
							})
						}
						href={resolve('/evm/selectors')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM selectors in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionEvmProtocolTopics({ id, label, open })}
					<EvmTopicsView
						selection={
							selection.$$evmTopics({
								count: true,
							})
						}
						href={resolve('/evm/topics')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM topics in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-evm-protocol-errors'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'evm-protocol-error-list',
							label: 'Errors',
						},
					]
				}
				data-card
				class='network-view-collapsible-errors'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Errors</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionEvmProtocolErrorList({ id, label, open })}
					<EvmErrorsView
						selection={
							selection.$$evmErrors({
								count: true,
							})
						}
						href={resolve('/evm/errors')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No EVM errors in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
