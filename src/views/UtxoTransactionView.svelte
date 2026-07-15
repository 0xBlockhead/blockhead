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
			selection: RegisteredEntityProxyResource<EntityType.UtxoTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.UtxoTransaction>>
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
	const utxoTransaction = $derived(selection({
		fields: {
			feeSats: true,
			isCoinbase: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction')
	const viewDomId = $derived('utxo-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
	import ZcashShieldedActionsView from '$/views/ZcashShieldedActionsView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.txId !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
			transactionId: String(pendingEntity.txId ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.txId !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
			transactionId: String(pendingEntity.txId ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={utxoTransaction}>
			{#snippet Pending()}
				{@const txId0 = pendingEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txId0 = resolvedEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={utxoTransaction}>
			{#snippet Pending()}
				{@const txId0 = pendingEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txId0 = resolvedEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoTransaction}>
			{#snippet Pending()}
				{@const feeSats0 = pendingEntity.feeSats}
				{#if feeSats0 !== undefined && feeSats0 !== null}
					<span data-text="muted">
						{String((feeSats0) ?? '')}
					</span>
				{/if}
				{@const isCoinbase1 = pendingEntity.isCoinbase}
				{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
					<span data-text="muted">
						{isCoinbase1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const feeSats0 = resolvedEntity.feeSats}
				{#if feeSats0 !== undefined && feeSats0 !== null}
					<span data-text="muted">
						{String((feeSats0) ?? '')}
					</span>
				{/if}
				{@const isCoinbase1 = resolvedEntity.isCoinbase}
				{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
					<span data-text="muted">
						{isCoinbase1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = pendingEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
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
				{#snippet Pending()}
					{@const lockTime = pendingEntity.lockTime}
					{#if lockTime !== undefined && lockTime !== null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{String((lockTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockTime = resolvedEntity.lockTime}
					{#if lockTime !== undefined && lockTime !== null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{String((lockTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isCoinbase: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isCoinbase = pendingEntity.isCoinbase}
					{#if isCoinbase !== undefined && isCoinbase !== null}
						<div>
							<dt>Coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isCoinbase = resolvedEntity.isCoinbase}
					{#if isCoinbase !== undefined && isCoinbase !== null}
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
				{#snippet Pending()}
					{@const sizeBytes = pendingEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>Size</dt>
							<dd>
								{String((sizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>Size</dt>
							<dd>
								{String((sizeBytes) ?? '')}
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
				{#snippet Pending()}
					{@const virtualSizeBytes = pendingEntity.virtualSizeBytes}
					{#if virtualSizeBytes !== undefined && virtualSizeBytes !== null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{String((virtualSizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualSizeBytes = resolvedEntity.virtualSizeBytes}
					{#if virtualSizeBytes !== undefined && virtualSizeBytes !== null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{String((virtualSizeBytes) ?? '')}
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
				{#snippet Pending()}
					{@const weightUnits = pendingEntity.weightUnits}
					{#if weightUnits !== undefined && weightUnits !== null}
						<div>
							<dt>Weight</dt>
							<dd>
								{String((weightUnits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const weightUnits = resolvedEntity.weightUnits}
					{#if weightUnits !== undefined && weightUnits !== null}
						<div>
							<dt>Weight</dt>
							<dd>
								{String((weightUnits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeSats = pendingEntity.feeSats}
					{#if feeSats !== undefined && feeSats !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue value={Number(feeSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeSats = resolvedEntity.feeSats}
					{#if feeSats !== undefined && feeSats !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue value={Number(feeSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(utxoBlock)}
					{#if utxoBlock != null && utxoBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<UtxoBlockView
									selection={select(EntityType.UtxoBlock, utxoBlock[EntityMetaKey.Selector])}
									prefetched={utxoBlock}
									href={
										(utxoBlock[EntityMetaKey.Selector].height !== undefined && utxoBlock[EntityMetaKey.Selector].hash !== undefined && utxoBlock[EntityMetaKey.Selector].$network !== undefined && utxoBlock[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
											blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
											hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
											network: String(caip2StringFromValue(utxoBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : utxoBlock[EntityMetaKey.Selector].height !== undefined && utxoBlock[EntityMetaKey.Selector].hash !== undefined && utxoBlock[EntityMetaKey.Selector].$network !== undefined && utxoBlock[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
											blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
											hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
											network: String(utxoBlock[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
					]
				}
				data-card
				class='network-view-collapsible-activity-a'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionUtxoTransactionInputs({ id, label, open })}
					<UtxoInputsView
						selection={
							selection.$$inputs({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No inputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionUtxoTransactionOutputs({ id, label, open })}
					<UtxoOutputsView
						selection={
							selection.$$outputs({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No outputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-utxo-transaction-activity-b'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'utxo-transaction-zcash-shielded-actions',
							label: 'Zcash Shielded Actions',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity-b'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity continued</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionUtxoTransactionZcashShieldedActions({ id, label, open })}
					<ZcashShieldedActionsView
						selection={
							selection.$$zcashShieldedActions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No zcash shielded actions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
