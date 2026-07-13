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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitcoinCashCashTokenCommitment>>
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
	const bitcoinCashCashTokenCommitment = $derived(selection({
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			commitmentHex: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment')
	const viewDomId = $derived('bitcoin-cash-cash-token-commitment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$output !== undefined && pendingEntity.$output.$transaction !== undefined && pendingEntity.$output.$transaction.$network !== undefined && pendingEntity.$output.$transaction.$network.slug !== undefined && pendingEntity.$output.$transaction.txId !== undefined && pendingEntity.$output.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
			network: String(pendingEntity.$output.$transaction.$network.slug ?? ''),
			transactionId: String(pendingEntity.$output.$transaction.txId ?? ''),
			outputIndex: String(pendingEntity.$output.indexInTransaction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet Pending()}
				{@const commitmentHex0 = pendingEntity.commitmentHex}
				{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
					<TruncatedValue value={String((commitmentHex0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const commitmentHex0 = resolvedEntity.commitmentHex}
				{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
					<TruncatedValue value={String((commitmentHex0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet Pending()}
				{@const commitmentHex0 = pendingEntity.commitmentHex}
				{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
					<TruncatedValue value={String((commitmentHex0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const commitmentHex0 = resolvedEntity.commitmentHex}
				{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
					<TruncatedValue value={String((commitmentHex0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet Pending()}
				<span data-text="muted">
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						href={
							(selection.entitySelector.$output.$transaction !== undefined && selection.entitySelector.$output.$transaction.$network !== undefined && selection.entitySelector.$output.$transaction.$network.slug !== undefined && selection.entitySelector.$output.$transaction.txId !== undefined && selection.entitySelector.$output.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
								network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
								transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
								outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
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
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						href={
							(selection.entitySelector.$output.$transaction !== undefined && selection.entitySelector.$output.$transaction.$network !== undefined && selection.entitySelector.$output.$transaction.$network.slug !== undefined && selection.entitySelector.$output.$transaction.txId !== undefined && selection.entitySelector.$output.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
								network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
								transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
								outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
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
				<dt>Commitment hex</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.BitcoinCashNode_JsonRpc,
								],
								fields: {
									commitmentHex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commitmentHex = pendingEntity.commitmentHex}
							{#if commitmentHex !== undefined && commitmentHex !== null}
								<TruncatedValue value={String((commitmentHex) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commitmentHex = resolvedEntity.commitmentHex}
							{#if commitmentHex !== undefined && commitmentHex !== null}
								<TruncatedValue value={String((commitmentHex) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output, {})}
						href={
							(selection.entitySelector.$output.$transaction !== undefined && selection.entitySelector.$output.$transaction.$network !== undefined && selection.entitySelector.$output.$transaction.$network.slug !== undefined && selection.entitySelector.$output.$transaction.txId !== undefined && selection.entitySelector.$output.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
								network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
								transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
								outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
