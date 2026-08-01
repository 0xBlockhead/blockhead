<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadSessionAction> = $props()

	const blockheadSessionAction = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	})({
		fields: {
			indexInSequence: true,
			actionType: true,
			createdAt: true,
			updatedAt: true,
			selectedProtocol: true,
		},
	}))
	const titleFallback = $derived((prefetched.actionType ?? '') || 'blockhead session action')
	const viewDomId = $derived('blockhead-session-action-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet children(entity)}
				{entity.actionType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet children(entity)}
				{(entity.selectedProtocol ?? '') || entity.actionType || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSessionAction}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.indexInSequence}
					/>
				</span>
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
							<BlockheadSessionView
								selection={select(EntityType.BlockheadSession, blockheadSession[EntityMetaKey.Selector])}
								prefetched={blockheadSession}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action ID</dt>
				<dd>
					{selection.entitySelector.actionId}
				</dd>
			</div>

			<div>
				<dt>index in sequence</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionAction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.indexInSequence}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>action type</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionAction}
					>
						{#snippet children(entity)}
							{entity.actionType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadSessionAction}
			>
				{#snippet children(entity)}
					{@const selectedProtocol = entity.selectedProtocol}
					{#if selectedProtocol != null}
						<div>
							<dt>selected protocol</dt>
							<dd>
								{selectedProtocol}
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
						resource={blockheadSessionAction}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSessionAction}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.updatedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$originInvocation}
			>
				{#snippet children(blockheadIntentInvocation)}
					{#if blockheadIntentInvocation != null}
						<div>
							<dt>origin invocation</dt>
							<dd>
								<BlockheadIntentInvocationView
									selection={select(EntityType.BlockheadIntentInvocation, blockheadIntentInvocation[EntityMetaKey.Selector])}
									prefetched={blockheadIntentInvocation}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					collapsible={false}
					title={label}
					emptyText='No readiness checks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSessionActionQuotes({ id, label, open })}
				<BlockheadIntentQuotesView
					selection={selection.$$quotes}
					collapsible={false}
					title={label}
					emptyText='No quotes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSessionActionOrders({ id, label, open })}
				<BlockheadIntentOrdersView
					selection={selection.$$orders}
					collapsible={false}
					title={label}
					emptyText='No orders.'
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
					collapsible={false}
					title={label}
					emptyText='No wallet requests.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionSessionActionOutcomes({ id, label, open })}
				<BlockheadActionOutcomesView
					selection={selection.$$outcomes}
					collapsible={false}
					title={label}
					emptyText='No outcomes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
