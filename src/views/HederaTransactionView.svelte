<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaTransaction> = $props()

	const network = $derived(selection.entitySelector.$network)
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
	href={
		href === undefined ?
			(
				'transactionId' in selection.entitySelector
				&& 'nonce' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/nonce/[nonce=nonNegativeInteger]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							transactionId: selection.entitySelector.transactionId,
							nonce: String(selection.entitySelector.nonce),
						}
					)
				:
					'consensusTimestamp' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								consensusTimestamp: selection.entitySelector.consensusTimestamp,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
						{@const hederaBlockInitial = untrack(() => hederaBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<HederaBlockView
									selection={select(EntityType.HederaBlock, (hederaBlock ?? hederaBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const hederaScheduleInitial = untrack(() => hederaSchedule)}
						<div>
							<dt>schedule</dt>
							<dd>
								<HederaScheduleView
									selection={select(EntityType.HederaSchedule, (hederaSchedule ?? hederaScheduleInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionHederaTransactionHbarTransfers({ id, label })}
				<HederaHbarTransfersView
					selection={selection.$$hbarTransfers}
					collapsible={false}
					title={label}
					emptyText='No hbar transfers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaTransactionTokenTransfers({ id, label })}
				<HederaTokenTransfersView
					selection={selection.$$tokenTransfers}
					collapsible={false}
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

			{#snippet SectionHederaTransactionContractResults({ id, label })}
				<HederaContractResultsView
					selection={selection.$$contractResults}
					collapsible={false}
					title={label}
					emptyText='No contract results.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
