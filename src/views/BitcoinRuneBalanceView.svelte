<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BitcoinRuneBalance> = $props()

	const output = $derived(selection.entitySelector.$output)
	const address = $derived(selection.entitySelector.$address)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.UniSat_Rest,
		],
	}))
	const bitcoinRuneBalance = $derived(viewSelection({
		fields: {
			amount: true,
		},
	}))
	const titleFallback = $derived((prefetched.amount ?? '') || 'Bitcoin Rune balance')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinRuneView from '$/views/BitcoinRuneView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinRuneBalance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'$output' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/rune/[runeId=stringSegment]',
						{
							network: (
								'caip2' in output.$transaction.$network ?
									caip2StringFromValue(output.$transaction.$network.caip2)
								:
									output.$transaction.$network.slug
							),
							transactionId: output.$transaction.txId,
							outputIndex: String(output.indexInTransaction),
							runeId: selection.entitySelector.$rune.runeId,
						}
					)
				:
					'$address' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/rune/[runeId=stringSegment]',
							{
								network: (
									'caip2' in address.$network ?
										caip2StringFromValue(address.$network.caip2)
									:
										address.$network.slug
								),
								address: address.address,
								runeId: selection.entitySelector.$rune.runeId,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinRuneBalance}>
			{#snippet children(entity)}
				{entity.amount || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<BitcoinRuneView
			selection={select(EntityType.BitcoinRune, selection.entitySelector.$rune)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Rune</dt>
				<dd>
					<BitcoinRuneView
						selection={select(EntityType.BitcoinRune, selection.entitySelector.$rune)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={bitcoinRuneBalance}
					>
						{#snippet children(entity)}
							{entity.amount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							divisibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const divisibility = entity.divisibility}
					{#if divisibility != null}
						<div>
							<dt>Divisibility</dt>
							<dd>
								{divisibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Output</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$output}
					>
						{#snippet children(utxoOutput)}
							<UtxoOutputView
								selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$address}
					>
						{#snippet children(utxoAddress)}
							<UtxoAddressView
								selection={select(EntityType.UtxoAddress, utxoAddress[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
