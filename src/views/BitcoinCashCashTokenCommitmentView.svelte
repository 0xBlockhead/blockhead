<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BitcoinCashCashTokenCommitment> = $props()

	const output = $derived(selection.entitySelector.$output)
	const bitcoinCashCashTokenCommitment = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			commitmentHex: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.commitmentHex ?? '') || 'Bitcoin Cash CashToken commitment')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-commitment',
				{
					network: (
						'caip2' in output.$transaction.$network ?
							caip2StringFromValue(output.$transaction.$network.caip2)
						:
							output.$transaction.$network.slug
					),
					transactionId: output.$transaction.txId,
					outputIndex: String(output.indexInTransaction),
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
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.commitmentHex} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.commitmentHex} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<UtxoOutputView
				selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Commitment hex</dt>
				<dd>
					<ResourceBoundary
						resource={bitcoinCashCashTokenCommitment}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.commitmentHex} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
