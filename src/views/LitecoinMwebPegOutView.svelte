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
	}: Omit<EntitySelectionViewProps<EntityType.LitecoinMwebPegOut>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegOut}
	entitySelector={selection.entitySelector}
	title={title ?? 'litecoin MWEB peg out'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/mweb/(litecoinMwebBlock)/transaction/[transactionIndex=nonNegativeInteger]/(litecoinMwebTransaction)/peg-out/[pegOutIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$mwebBlock.$block.$network ?
							caip2StringFromValue(transaction.$mwebBlock.$block.$network.caip2)
						:
							transaction.$mwebBlock.$block.$network.slug
					),
					blockNumber: String(transaction.$mwebBlock.$block.height),
					transactionIndex: String(transaction.transactionIndex),
					pegOutIndex: String(selection.entitySelector.pegOutIndex),
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
		<LitecoinMwebTransactionView
			selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.pegOutIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$transparentOutput}
		>
			{#snippet children(utxoOutput)}
				{#if utxoOutput != null}
					{@const utxoOutputInitial = untrack(() => utxoOutput)}
					<span data-text="muted">
						<UtxoOutputView
							selection={select(EntityType.UtxoOutput, (utxoOutput ?? utxoOutputInitial)[EntityMetaKey.Selector])}
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
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>peg out index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.pegOutIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transparentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						{@const utxoOutputInitial = untrack(() => utxoOutput)}
						<div>
							<dt>transparent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, (utxoOutput ?? utxoOutputInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.LitecoinCore_JsonRpc,
						],
					})({
						fields: {
							amountLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountLitoshis = entity.amountLitoshis}
					{#if amountLitoshis != null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue
									value={amountLitoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
