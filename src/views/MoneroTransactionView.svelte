<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MoneroTransaction>>
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
	const moneroTransaction = $derived(selection({
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			$block: true,
			feeAtomicUnits: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txHash ?? prefetched.txHash) ?? '')].filter(Boolean).join(' ') || 'monero transaction')
	const viewDomId = $derived('monero-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroKeyImagesView from '$/views/MoneroKeyImagesView.svelte'
	import MoneroStealthOutputsView from '$/views/MoneroStealthOutputsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MoneroBlockView from '$/views/MoneroBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moneroTransaction}>
			{#snippet Pending()}
				{@const txHash0 = selection.entitySelector.txHash ?? prefetched.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txHash0 = resolvedEntity.txHash}
				{#if txHash0 !== undefined && txHash0 !== null}
					<TruncatedValue value={String((txHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroTransaction}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.MoneroBlock, false>('$block', {
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				>
					{#snippet children(moneroBlock)}
						{#if moneroBlock != null && moneroBlock[EntityMetaKey.Selector] != null}
							<MoneroBlockView
								selection={select(EntityType.MoneroBlock, moneroBlock[EntityMetaKey.Selector])}
								prefetched={moneroBlock}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.MoneroBlock, false>('$block', {
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				>
					{#snippet children(moneroBlock)}
						{#if moneroBlock != null && moneroBlock[EntityMetaKey.Selector] != null}
							<MoneroBlockView
								selection={select(EntityType.MoneroBlock, moneroBlock[EntityMetaKey.Selector])}
								prefetched={moneroBlock}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroTransaction}>
			{#snippet Pending()}
				{@const feeAtomicUnits0 = prefetched.feeAtomicUnits}
				{#if feeAtomicUnits0 !== undefined && feeAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(feeAtomicUnits0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const feeAtomicUnits0 = resolvedEntity.feeAtomicUnits}
				{#if feeAtomicUnits0 !== undefined && feeAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(feeAtomicUnits0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txHash = selection.entitySelector.txHash ?? prefetched.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txHash = resolvedEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection[EntityProxyField]<EntityType.MoneroBlock, false>('$block', {
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet children(moneroBlock)}
					{#if moneroBlock != null && moneroBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<MoneroBlockView
									selection={select(EntityType.MoneroBlock, moneroBlock[EntityMetaKey.Selector])}
									prefetched={moneroBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								<NumberValue value={Number(version)} />
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
								<NumberValue value={Number(version)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							unlockTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unlockTime = prefetched.unlockTime}
					{#if unlockTime !== undefined && unlockTime !== null}
						<div>
							<dt>Unlock time</dt>
							<dd>
								<NumberValue value={Number(unlockTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlockTime = resolvedEntity.unlockTime}
					{#if unlockTime !== undefined && unlockTime !== null}
						<div>
							<dt>Unlock time</dt>
							<dd>
								<NumberValue value={Number(unlockTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							feeAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeAtomicUnits = prefetched.feeAtomicUnits}
					{#if feeAtomicUnits !== undefined && feeAtomicUnits !== null}
						<div>
							<dt>Fee atomic units</dt>
							<dd>
								<NumberValue value={Number(feeAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeAtomicUnits = resolvedEntity.feeAtomicUnits}
					{#if feeAtomicUnits !== undefined && feeAtomicUnits !== null}
						<div>
							<dt>Fee atomic units</dt>
							<dd>
								<NumberValue value={Number(feeAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MoneroKeyImagesView
				selection={
						selection[EntityProxyField]<EntityType.MoneroKeyImage>('$$keyImages', {
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				title='Key images'
				id='MoneroKeyImagesView-$$keyImages'
			/>

			<MoneroStealthOutputsView
				selection={
						selection[EntityProxyField]<EntityType.MoneroStealthOutput>('$$stealthOutputs', {
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				title='Stealth outputs'
				id='MoneroStealthOutputsView-$$stealthOutputs'
			/>
		{/if}
	{/snippet}
</EntityView>
