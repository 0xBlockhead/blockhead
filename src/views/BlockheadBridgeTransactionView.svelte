<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBridgeTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadBridgeTransaction>>
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
	const blockheadBridgeTransaction = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.createdAt ?? prefetched.createdAt) ?? '')].filter(Boolean).join(' ') || 'bridge transaction')
	const viewDomId = $derived('blockhead-bridge-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBridgeTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadBridgeTransaction}>
			{#snippet Pending()}
				{@const createdAt0 = selection.entitySelector.createdAt ?? prefetched.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<Timestamp timestamp={Number(createdAt0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBridgeTransaction}>
			{#snippet Pending()}
				<EvmTransactionView
					selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
					href={
						(selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.namespace !== undefined && selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.reference !== undefined && selection.entitySelector.$sourceTx.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
							caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference ?? '')}`,
							transactionId: String(selection.entitySelector.$sourceTx.txHash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmTransactionView
					selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
					href={
						(selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.namespace !== undefined && selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.reference !== undefined && selection.entitySelector.$sourceTx.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
							caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference ?? '')}`,
							transactionId: String(selection.entitySelector.$sourceTx.txHash ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadBridgeTransaction}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
						href={
							(selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
						href={
							(selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$account.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx, {})}
						href={
							(selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.namespace !== undefined && selection.entitySelector.$sourceTx.$network !== undefined && selection.entitySelector.$sourceTx.$network.caip2 !== undefined && selection.entitySelector.$sourceTx.$network.caip2.reference !== undefined && selection.entitySelector.$sourceTx.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference ?? '')}`,
								transactionId: String(selection.entitySelector.$sourceTx.txHash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = selection.entitySelector.createdAt ?? prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$bridgeTransfer}
			>
				{#snippet children(bridgeTransfer)}
					{#if bridgeTransfer != null && bridgeTransfer[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bridge transfer</dt>
							<dd>
								<BridgeTransferView
									selection={select(EntityType.BridgeTransfer, bridgeTransfer[EntityMetaKey.Selector])}
									prefetched={bridgeTransfer}
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
</EntityView>
