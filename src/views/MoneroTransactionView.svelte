<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoneroTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const moneroTransaction = $derived(viewSelection({
		fields: {
			feeAtomicUnits: true,
		},
	}))


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
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.txHash || 'monero transaction')}
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
					transactionId: selection.entitySelector.txHash,
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
		<TruncatedValue value={selection.entitySelector.txHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(moneroBlock)}
				{#if moneroBlock != null}
					{@const moneroBlockInitial = untrack(() => moneroBlock)}
					<MoneroBlockView
						selection={select(EntityType.MoneroBlock, (moneroBlock ?? moneroBlockInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroTransaction}>
			{#snippet children(entity)}
				{@const feeAtomicUnits = entity.feeAtomicUnits}
				{#if feeAtomicUnits != null}
					<span data-text="muted">
						<NumberValue
							value={feeAtomicUnits}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(moneroBlock)}
					{#if moneroBlock != null}
						{@const moneroBlockInitial = untrack(() => moneroBlock)}
						<div>
							<dt>Block</dt>
							<dd>
								<MoneroBlockView
									selection={select(EntityType.MoneroBlock, (moneroBlock ?? moneroBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
					viewSelection({
						fields: {
							unlockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unlockTime = entity.unlockTime}
					{#if unlockTime != null}
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
				resource={moneroTransaction}
			>
				{#snippet children(entity)}
					{@const feeAtomicUnits = entity.feeAtomicUnits}
					{#if feeAtomicUnits != null}
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

	{#snippet Details()}
		{@const keyImagesResource = selection.$$keyImages}
		<ResourceBoundary
			resource={keyImagesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroKeyImagesView
						selection={keyImagesResource}
						countResource={keyImagesResource.count}
						title='Key images'
						id='key-images'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const stealthOutputsResource = selection.$$stealthOutputs}
		<ResourceBoundary
			resource={stealthOutputsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MoneroStealthOutputsView
						selection={stealthOutputsResource}
						countResource={stealthOutputsResource.count}
						title='Stealth outputs'
						id='stealth-outputs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
