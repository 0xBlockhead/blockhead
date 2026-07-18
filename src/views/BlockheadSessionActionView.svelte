<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadSessionAction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadSessionAction>>
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
	const blockheadSessionAction = $derived(selection({
		sources: selection.sources,
		fields: {
			indexInSequence: true,
			actionType: true,
			createdAt: true,
			updatedAt: true,
			selectedProtocol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.actionType) ?? '')].filter(Boolean).join(' ') || 'blockhead session action')
	const viewDomId = $derived('blockhead-session-action-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
	import BlockheadIntentInvocationView from '$/views/BlockheadIntentInvocationView.svelte'
	import BlockheadActionReadinessChecksView from '$/views/BlockheadActionReadinessChecksView.svelte'
	import BlockheadIntentQuotesView from '$/views/BlockheadIntentQuotesView.svelte'
	import BlockheadIntentOrdersView from '$/views/BlockheadIntentOrdersView.svelte'
	import BlockheadWalletRequestsView from '$/views/BlockheadWalletRequestsView.svelte'
	import BlockheadActionOutcomesView from '$/views/BlockheadActionOutcomesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSessionAction}
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
			{[String((pendingEntity.actionType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSessionAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.actionType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.selectedProtocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.actionType) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadSessionAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.selectedProtocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.actionType) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const indexInSequence0 = pendingEntity.indexInSequence}
			{#if indexInSequence0 !== undefined && indexInSequence0 !== null}
				<span data-text="muted">
					<NumberValue
						value={indexInSequence0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadSessionAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexInSequence0 = resolvedEntity.indexInSequence}
					{#if indexInSequence0 !== undefined && indexInSequence0 !== null}
						<span data-text="muted">
							<NumberValue
								value={indexInSequence0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$session}
					>
						{#snippet children(blockheadSession)}
							{#if blockheadSession != null && blockheadSession[EntityMetaKey.Selector] != null}
								<BlockheadSessionView
									selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
									prefetched={blockheadSession}
									href={
										(blockheadSession[EntityMetaKey.Selector].id !== undefined ? resolve('/~/session/[sessionId=stringSegment]', {
											sessionId: String(blockheadSession[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									actionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionId = resolvedEntity.actionId}
							{#if actionId !== undefined && actionId !== null}
								{String((actionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>index in sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInSequence: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInSequence = resolvedEntity.indexInSequence}
							{#if indexInSequence !== undefined && indexInSequence !== null}
								<NumberValue
									value={indexInSequence}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									actionType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionType = resolvedEntity.actionType}
							{#if actionType !== undefined && actionType !== null}
								{String((actionType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							selectedProtocol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const selectedProtocol = resolvedEntity.selectedProtocol}
					{#if selectedProtocol !== undefined && selectedProtocol !== null}
						<div>
							<dt>selected protocol</dt>
							<dd>
								{String((selectedProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const updatedAt = resolvedEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$originInvocation}
			>
				{#snippet children(blockheadIntentInvocation)}
					{#if blockheadIntentInvocation != null && blockheadIntentInvocation[EntityMetaKey.Selector] != null}
						<div>
							<dt>origin invocation</dt>
							<dd>
								<BlockheadIntentInvocationView
									selection={select(EntityType.BlockheadIntentInvocation, blockheadIntentInvocation[EntityMetaKey.Selector])}
									prefetched={blockheadIntentInvocation}
									layout={EntityLayout.Value}
									open={false}
								/>
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
				id={viewDomId + '-carousel-session-action-planning'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'session-action-readiness',
							label: 'Readiness checks',
						},
						{
							id: 'session-action-quotes',
							label: 'Quotes',
						},
						{
							id: 'session-action-orders',
							label: 'Orders',
						},
					]
				}
				data-card
				class='network-view-collapsible-planning'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Planning</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSessionActionReadiness({ id, label, open })}
					<BlockheadActionReadinessChecksView
						selection={selection.$$readinessChecks}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No readiness checks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionQuotes({ id, label, open })}
					<BlockheadIntentQuotesView
						selection={selection.$$quotes}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No quotes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionOrders({ id, label, open })}
					<BlockheadIntentOrdersView
						selection={selection.$$orders}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No orders.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-session-action-execution'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'session-action-wallet-requests',
							label: 'Wallet requests',
						},
						{
							id: 'session-action-outcomes',
							label: 'Outcomes',
						},
					]
				}
				data-card
				class='network-view-collapsible-execution'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Execution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSessionActionWalletRequests({ id, label, open })}
					<BlockheadWalletRequestsView
						selection={selection.$$walletRequests}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No wallet requests.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionOutcomes({ id, label, open })}
					<BlockheadActionOutcomesView
						selection={selection.$$outcomes}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No outcomes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
