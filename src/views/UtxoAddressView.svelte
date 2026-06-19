<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.UtxoAddress>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const utxoAddress = $derived(selection({
		sources: [Source.Blockchair_Rest],
		fields: {
			balanceSats: true,
			transactionCount: true,
			unspentOutputCount: true,
			totalReceivedSats: true,
			totalSpentSats: true,
		},
	}))
	
	
	
	
	



	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<dl>
			<ResourceBoundary
				resource={utxoAddress.balanceSats}
				placeholderText="Loading UTXO address balance..."
			>
				{#snippet children(balanceSats)}
					{#if balanceSats != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={balanceSats} /> sats</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoAddress.transactionCount}
				placeholderText="Loading UTXO address transaction count..."
			>
				{#snippet children(transactionCount)}
					{#if transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={transactionCount} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoAddress.unspentOutputCount}
				placeholderText="Loading UTXO count..."
			>
				{#snippet children(unspentOutputCount)}
					{#if unspentOutputCount != null}
						<div>
							<dt>UTXOs</dt>
							<dd><NumberValue value={unspentOutputCount} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary
					resource={utxoAddress.totalReceivedSats}
					placeholderText="Loading total received..."
				>
					{#snippet children(totalReceivedSats)}
						{#if totalReceivedSats != null}
							<div>
								<dt>Total received</dt>
								<dd><NumberValue value={totalReceivedSats} /> sats</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={utxoAddress.totalSpentSats}
					placeholderText="Loading total spent..."
				>
					{#snippet children(totalSpentSats)}
						{#if totalSpentSats != null}
							<div>
								<dt>Total spent</dt>
								<dd><NumberValue value={totalSpentSats} /> sats</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
