<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.UtxoAddress>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoAddress = subscribe(EntityType.UtxoAddress,
		selector,
		({ fields: { balanceSats: true, transactionCount: true, unspentOutputCount: true, totalReceivedSats: true, totalSpentSats: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress}
	entitySelector={selector}
	title={selector.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={utxoAddress}
			placeholderText="Loading UTXO address..."
		>
			{#snippet children(utxoAddress)}
				<dl>
					{#if utxoAddress.fields.balanceSats != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={utxoAddress.fields.balanceSats} /> sats</dd>
						</div>
					{/if}

					{#if utxoAddress.fields.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={utxoAddress.fields.transactionCount} /></dd>
						</div>
					{/if}

					{#if utxoAddress.fields.unspentOutputCount != null}
						<div>
							<dt>UTXOs</dt>
							<dd><NumberValue value={utxoAddress.fields.unspentOutputCount} /></dd>
						</div>
					{/if}

					{#if open && utxoAddress.fields.totalReceivedSats != null}
						<div>
							<dt>Total received</dt>
							<dd><NumberValue value={utxoAddress.fields.totalReceivedSats} /> sats</dd>
						</div>
					{/if}

					{#if open && utxoAddress.fields.totalSpentSats != null}
						<div>
							<dt>Total spent</dt>
							<dd><NumberValue value={utxoAddress.fields.totalSpentSats} /> sats</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
