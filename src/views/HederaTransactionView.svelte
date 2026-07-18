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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.HederaTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HederaTransaction>>
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
	const hederaTransaction = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('hedera transaction')
	const viewDomId = $derived('hedera-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={hederaTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>consensus timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									consensusTimestamp: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const consensusTimestamp = resolvedEntity.consensusTimestamp}
							{#if consensusTimestamp !== undefined && consensusTimestamp !== null}
								{String((consensusTimestamp) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
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
								sources: selection.sources,
								fields: {
									nonce: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nonce = resolvedEntity.nonce}
							{#if nonce !== undefined && nonce !== null}
								{String((nonce) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionType = resolvedEntity.transactionType}
							{#if transactionType !== undefined && transactionType !== null}
								{String((transactionType) ?? '')}
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
							payerAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payerAccount = resolvedEntity.payerAccount}
					{#if payerAccount !== undefined && payerAccount !== null}
						<div>
							<dt>payer account</dt>
							<dd>
								<TruncatedValue value={String((payerAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							result: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const result = resolvedEntity.result}
					{#if result !== undefined && result !== null}
						<div>
							<dt>result</dt>
							<dd>
								{String((result) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							chargedTxFeeTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chargedTxFeeTinybar = resolvedEntity.chargedTxFeeTinybar}
					{#if chargedTxFeeTinybar !== undefined && chargedTxFeeTinybar !== null}
						<div>
							<dt>charged transaction fee tinybar</dt>
							<dd>
								{String((chargedTxFeeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							validStartTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validStartTimestamp = resolvedEntity.validStartTimestamp}
					{#if validStartTimestamp !== undefined && validStartTimestamp !== null}
						<div>
							<dt>valid start timestamp</dt>
							<dd>
								{String((validStartTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nodeAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeAccountId = resolvedEntity.nodeAccountId}
					{#if nodeAccountId !== undefined && nodeAccountId !== null}
						<div>
							<dt>node account ID</dt>
							<dd>
								<TruncatedValue value={String((nodeAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							scheduled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const scheduled = resolvedEntity.scheduled}
					{#if scheduled !== undefined && scheduled !== null}
						<div>
							<dt>scheduled</dt>
							<dd>
								{scheduled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(hederaBlock)}
					{#if hederaBlock != null && hederaBlock[EntityMetaKey.Selector] != null}
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
					{#if hederaSchedule != null && hederaSchedule[EntityMetaKey.Selector] != null}
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
		{#if detailsOpen}
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
						emptyText='No hbar transfers.'
						open={open}
						title={label}
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
						emptyText='No token transfers.'
						open={open}
						title={label}
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
						emptyText='No contract results.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
