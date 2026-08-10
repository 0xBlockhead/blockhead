<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.MoneroKeyImage>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroKeyImage}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.keyImage || 'monero key image')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/key-image/[inputIndex=nonNegativeInteger]/[keyImage=stringSegment]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txHash,
					inputIndex: String(selection.entitySelector.inputIndex),
					keyImage: selection.entitySelector.keyImage,
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
		<TruncatedValue value={selection.entitySelector.keyImage} />
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.inputIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$ring}
		>
			{#snippet children(moneroRing)}
				{#if moneroRing != null}
					{@const moneroRingInitial = untrack(() => moneroRing)}
					<span data-text="muted">
						<MoneroRingView
							selection={select(EntityType.MoneroRing, (moneroRing ?? moneroRingInitial)[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<MoneroTransactionView
						selection={select(EntityType.MoneroTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Input index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.inputIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Key image</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keyImage} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$ring}
			>
				{#snippet children(moneroRing)}
					{#if moneroRing != null}
						{@const moneroRingInitial = untrack(() => moneroRing)}
						<div>
							<dt>Ring</dt>
							<dd>
								<MoneroRingView
									selection={select(EntityType.MoneroRing, (moneroRing ?? moneroRingInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
