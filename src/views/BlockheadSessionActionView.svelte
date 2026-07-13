<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionAction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSessionAction>>
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
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$session: true,
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
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet Pending()}
				{[String((pendingEntity.actionType) ?? '')].filter(Boolean).join(' ') || title || 'blockhead session action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.actionType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet Pending()}
				{[String((pendingEntity.selectedProtocol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.actionType) ?? '')].filter(Boolean).join(' ') || title || 'blockhead session action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.selectedProtocol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.actionType) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet Pending()}
				{@const indexInSequence0 = pendingEntity.indexInSequence}
				{#if indexInSequence0 !== undefined && indexInSequence0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(indexInSequence0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const indexInSequence0 = resolvedEntity.indexInSequence}
				{#if indexInSequence0 !== undefined && indexInSequence0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(indexInSequence0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									actionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const actionId = pendingEntity.actionId}
							{#if actionId !== undefined && actionId !== null}
								{String((actionId) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									indexInSequence: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInSequence = pendingEntity.indexInSequence}
							{#if indexInSequence !== undefined && indexInSequence !== null}
								<NumberValue value={Number(indexInSequence)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInSequence = resolvedEntity.indexInSequence}
							{#if indexInSequence !== undefined && indexInSequence !== null}
								<NumberValue value={Number(indexInSequence)} />
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
								fields: {
									actionType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const actionType = pendingEntity.actionType}
							{#if actionType !== undefined && actionType !== null}
								{String((actionType) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							selectedProtocol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const selectedProtocol = pendingEntity.selectedProtocol}
					{#if selectedProtocol !== undefined && selectedProtocol !== null}
						<div>
							<dt>selected protocol</dt>
							<dd>
								{String((selectedProtocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

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
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const updatedAt = pendingEntity.updatedAt}
							{#if updatedAt !== undefined && updatedAt !== null}
								<Timestamp timestamp={Number(updatedAt)} />
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Planning</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSessionActionReadiness({ id, label, open })}
					<BlockheadActionReadinessChecksView
						selection={
							selection.$$readinessChecks({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No readiness checks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionQuotes({ id, label, open })}
					<BlockheadIntentQuotesView
						selection={
							selection.$$quotes({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No quotes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionOrders({ id, label, open })}
					<BlockheadIntentOrdersView
						selection={
							selection.$$orders({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Execution</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSessionActionWalletRequests({ id, label, open })}
					<BlockheadWalletRequestsView
						selection={
							selection.$$walletRequests({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No wallet requests.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionSessionActionOutcomes({ id, label, open })}
					<BlockheadActionOutcomesView
						selection={
							selection.$$outcomes({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
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
