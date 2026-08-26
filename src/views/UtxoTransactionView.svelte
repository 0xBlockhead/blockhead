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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.UtxoTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const utxoTransaction = $derived(selection({
		fields: {
			feeSats: true,
			isCoinbase: true,
		},
	}))
	const viewDomId = $derived('utxo-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BitcoinRunestoneView from '$/views/BitcoinRunestoneView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
	import BitcoinOrdinalInscriptionsView from '$/views/BitcoinOrdinalInscriptionsView.svelte'
	import ElementsPegsView from '$/views/ElementsPegsView.svelte'
	import UtxoTransaction_Mempool_TimestampsView from '$/views/UtxoTransaction_Mempool_TimestampsView.svelte'
	import ZcashShieldedActionsView from '$/views/ZcashShieldedActionsView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.txId || 'UTXO transaction')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					transactionId: selection.entitySelector.txId,
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
		<TruncatedValue value={selection.entitySelector.txId} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.txId} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoTransaction}>
			{#snippet children(entity)}
				{@const feeSats = entity.feeSats}
				{#if feeSats != null}
					<span data-text="muted">
						{feeSats}
					</span>
				{/if}
				{@const isCoinbase = entity.isCoinbase}
				{#if isCoinbase != null}
					<span data-text="muted">
						{isCoinbase ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lockTime = entity.lockTime}
					{#if lockTime != null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{lockTime}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoTransaction}
			>
				{#snippet children(entity)}
					{@const isCoinbase = entity.isCoinbase}
					{#if isCoinbase != null}
						<div>
							<dt>Coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd>
								{sizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							virtualSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualSizeBytes = entity.virtualSizeBytes}
					{#if virtualSizeBytes != null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{virtualSizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							weightUnits: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const weightUnits = entity.weightUnits}
					{#if weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd>
								{weightUnits}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoTransaction}
			>
				{#snippet children(entity)}
					{@const feeSats = entity.feeSats}
					{#if feeSats != null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue
									value={feeSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinRunestone}
			>
				{#snippet children(bitcoinRunestone)}
					{#if bitcoinRunestone != null}
						{@const bitcoinRunestoneInitial = untrack(() => bitcoinRunestone)}
						<div>
							<dt>Bitcoin runestone</dt>
							<dd>
								<BitcoinRunestoneView
									selection={select(EntityType.BitcoinRunestone, (bitcoinRunestone ?? bitcoinRunestoneInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(utxoBlock)}
					{#if utxoBlock != null}
						{@const utxoBlockInitial = untrack(() => utxoBlock)}
						<div>
							<dt>Block</dt>
							<dd>
								<UtxoBlockView
									selection={select(EntityType.UtxoBlock, (utxoBlock ?? utxoBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-utxo-transaction-activity-a'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'utxo-transaction-inputs',
						label: 'Inputs',
					},
					{
						id: 'utxo-transaction-outputs',
						label: 'Outputs',
					},
					{
						id: 'utxo-transaction-ordinal-inscriptions',
						label: 'Ordinal inscriptions',
					},
					{
						id: 'utxo-transaction-elements-pegs',
						label: 'Liquid pegs',
					},
					{
						id: 'utxo-transaction-mempool-observations',
						label: 'Mempool observations',
					},
					{
						id: 'utxo-transaction-zcash-shielded-actions',
						label: 'Zcash shielded actions',
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

			{#snippet SectionUtxoTransactionInputs({ id, label })}
				<UtxoInputsView
					selection={selection.$$inputs}
					collapsible={false}
					title={label}
					emptyText='No inputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactionOutputs({ id, label })}
				<UtxoOutputsView
					selection={selection.$$outputs}
					collapsible={false}
					title={label}
					emptyText='No outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactionOrdinalInscriptions({ id, label })}
				<BitcoinOrdinalInscriptionsView
					selection={selection.$$bitcoinOrdinalInscriptions}
					collapsible={false}
					title={label}
					emptyText='No Ordinal inscriptions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactionElementsPegs({ id, label })}
				<ElementsPegsView
					selection={selection.$$elementsPegs}
					collapsible={false}
					title={label}
					emptyText='No Liquid peg transition.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactionMempoolObservations({ id, label })}
				<UtxoTransaction_Mempool_TimestampsView
					selection={selection.$$mempoolTimestamps}
					collapsible={false}
					title={label}
					emptyText='No mempool observation.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionUtxoTransactionZcashShieldedActions({ id, label })}
				<ZcashShieldedActionsView
					selection={selection.$$zcashShieldedActions}
					collapsible={false}
					title={label}
					emptyText='No Zcash shielded actions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
