<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
	}: EntitySelectionViewProps<EntityType.HederaTransaction> = $props()

	const hederaTransaction = $derived(selection({
		fields: {
			transactionType: true,
			result: true,
			transactionId: true,
			consensusTimestamp: true,
		},
	}))
	const titleFallback = $derived((prefetched.transactionType ?? '') || (prefetched.transactionId ?? '') || 'hedera transaction')
	const viewDomId = $derived('hedera-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaBlockView from '$/views/HederaBlockView.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaHbarTransfersView from '$/views/HederaHbarTransfersView.svelte'
	import HederaTokenTransfersView from '$/views/HederaTokenTransfersView.svelte'
	import HederaContractResultsView from '$/views/HederaContractResultsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaTransaction}>
			{#snippet children(entity)}
				{entity.transactionType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hederaTransaction}>
			{#snippet children(entity)}
				{(entity.result ?? '') || entity.transactionType || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={hederaTransaction}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.consensusTimestamp}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					<ResourceBoundary
						resource={hederaTransaction}
					>
						{#snippet children(entity)}
							{entity.transactionType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={hederaTransaction}
			>
				{#snippet children(entity)}
					{@const result = entity.result}
					{#if result != null}
						<div>
							<dt>result</dt>
							<dd>
								{result}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={hederaTransaction}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.transactionId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>consensus timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={hederaTransaction}
					>
						{#snippet children(entity)}
							{entity.consensusTimestamp}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>nonce</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nonce: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.nonce}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							payerAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payerAccount = entity.payerAccount}
					{#if payerAccount != null}
						<div>
							<dt>payer account</dt>
							<dd>
								<TruncatedValue value={payerAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeAccountId = entity.nodeAccountId}
					{#if nodeAccountId != null}
						<div>
							<dt>node account ID</dt>
							<dd>
								<TruncatedValue value={nodeAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chargedTxFeeTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chargedTxFeeTinybar = entity.chargedTxFeeTinybar}
					{#if chargedTxFeeTinybar != null}
						<div>
							<dt>charged transaction fee tinybar</dt>
							<dd>
								<NumberValue
									value={chargedTxFeeTinybar}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scheduled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scheduled = entity.scheduled}
					{#if scheduled != null}
						<div>
							<dt>scheduled</dt>
							<dd>
								{scheduled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(hederaBlock)}
					{#if hederaBlock != null}
						<div>
							<dt>block</dt>
							<dd>
								<HederaBlockView
									selection={select(EntityType.HederaBlock, hederaBlock[EntityMetaKey.Selector])}
									prefetched={hederaBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$schedule}
			>
				{#snippet children(hederaSchedule)}
					{#if hederaSchedule != null}
						<div>
							<dt>schedule</dt>
							<dd>
								<HederaScheduleView
									selection={select(EntityType.HederaSchedule, hederaSchedule[EntityMetaKey.Selector])}
									prefetched={hederaSchedule}
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-transaction-activity-a'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-transaction-hbar-transfers',
						label: 'Hbar Transfers',
					},
					{
						id: 'hedera-transaction-token-transfers',
						label: 'Token Transfers',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-a'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHederaTransactionHbarTransfers({ id, label, open })}
				<HederaHbarTransfersView
					selection={selection.$$hbarTransfers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No hbar transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaTransactionTokenTransfers({ id, label, open })}
				<HederaTokenTransfersView
					selection={selection.$$tokenTransfers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No token transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-transaction-activity-b'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-transaction-contract-results',
						label: 'Contract Results',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-b'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity continued</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHederaTransactionContractResults({ id, label, open })}
				<HederaContractResultsView
					selection={selection.$$contractResults}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No contract results.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
