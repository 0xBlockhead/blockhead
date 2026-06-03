<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.UtxoAddress>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoAddress = useEntity(
		EntityType.UtxoAddress,
		entityId,
		{
			balanceSats: {},
			transactionCount: {},
			unspentOutputCount: {},
			totalReceivedSats: {},
			totalSpentSats: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
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
					{#if utxoAddress.balanceSats != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={utxoAddress.balanceSats} /> sats</dd>
						</div>
					{/if}

					{#if utxoAddress.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={utxoAddress.transactionCount} /></dd>
						</div>
					{/if}

					{#if utxoAddress.unspentOutputCount != null}
						<div>
							<dt>UTXOs</dt>
							<dd><NumberValue value={utxoAddress.unspentOutputCount} /></dd>
						</div>
					{/if}

					{#if open && utxoAddress.totalReceivedSats != null}
						<div>
							<dt>Total received</dt>
							<dd><NumberValue value={utxoAddress.totalReceivedSats} /> sats</dd>
						</div>
					{/if}

					{#if open && utxoAddress.totalSpentSats != null}
						<div>
							<dt>Total spent</dt>
							<dd><NumberValue value={utxoAddress.totalSpentSats} /> sats</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
