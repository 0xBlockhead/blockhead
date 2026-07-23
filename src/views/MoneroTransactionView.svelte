<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.MoneroTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.MoneroTransaction>
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
	const moneroTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			feeAtomicUnits: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			feeAtomicUnits: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'monero transaction')
	const viewDomId = $derived('monero-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
			{#snippet children(entity)}
				<ResourceBoundary
					resource={
						selection
							.$block({
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
								href=""
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
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const feeAtomicUnits0 = resolvedEntity.feeAtomicUnits}
				{#if feeAtomicUnits0 !== undefined && feeAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue
							value={feeAtomicUnits0}
						/>
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
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
								sources: selection.sources,
								fields: {
									txHash: true,
								},
							})
						}
					>
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
					selection
						.$block({
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
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								<NumberValue
									value={version}
								/>
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
							unlockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlockTime = resolvedEntity.unlockTime}
					{#if unlockTime !== undefined && unlockTime !== null}
						<div>
							<dt>Unlock time</dt>
							<dd>
								<NumberValue
									value={unlockTime}
								/>
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
							feeAtomicUnits: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeAtomicUnits = resolvedEntity.feeAtomicUnits}
					{#if feeAtomicUnits !== undefined && feeAtomicUnits !== null}
						<div>
							<dt>Fee atomic units</dt>
							<dd>
								<NumberValue
									value={feeAtomicUnits}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const moneroTransactionMoneroKeyImagesViewKeyImagesResource = selection
		.$$keyImages({
			sources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={moneroTransactionMoneroKeyImagesViewKeyImagesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<MoneroKeyImagesView
							selection={moneroTransactionMoneroKeyImagesViewKeyImagesResource}
							countResource={moneroTransactionMoneroKeyImagesViewKeyImagesResource.count}
							title='Key images'
							id='MoneroKeyImagesView-key-images'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const moneroTransactionMoneroStealthOutputsViewStealthOutputsResource = selection
		.$$stealthOutputs({
			sources: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
		})}
				<ResourceBoundary
					resource={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<MoneroStealthOutputsView
							selection={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource}
							countResource={moneroTransactionMoneroStealthOutputsViewStealthOutputsResource.count}
							title='Stealth outputs'
							id='MoneroStealthOutputsView-stealth-outputs'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
