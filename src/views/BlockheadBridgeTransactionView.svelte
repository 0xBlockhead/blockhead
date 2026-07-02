<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const blockheadBridgeTransaction = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			...(open && {
				$bridgeTransfer: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).createdAt) ?? '')].filter(Boolean).join(' ') || 'bridge transaction')
	const viewDomId = $derived('blockhead-bridge-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBridgeTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<Timestamp timestamp={Number(createdAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadBridgeTransaction}>
				{#snippet Pending()}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<Timestamp timestamp={Number(createdAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EvmTransactionView
				selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
				href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
							caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace)}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference)}`,
							transactionId: String(selection.entitySelector.$sourceTx.txHash),
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={blockheadBridgeTransaction}>
				{#snippet Pending()}
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace)}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$sourceTx.txHash),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$sourceTx)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$sourceTx.$network.caip2.namespace)}:${String(selection.entitySelector.$sourceTx.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$sourceTx.txHash),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
					href={
						resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$account.address),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={blockheadBridgeTransaction}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmAccountView
							selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
							href={
								resolve('/(explore)/account/[address=evmAddress]', {
									address: String(selection.entitySelector.$account.address),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmAccountView
							selection={select(EntityType.EvmAccount, selection.entitySelector.$account)}
							href={
								resolve('/(explore)/account/[address=evmAddress]', {
									address: String(selection.entitySelector.$account.address),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
