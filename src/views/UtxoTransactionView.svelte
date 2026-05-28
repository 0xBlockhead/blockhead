<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.UtxoTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transaction = useEntity(
		EntityType.UtxoTransaction,
		entityId,
		{
			$: [
				Source.Esplora_Rest,
				Source.Blockchair_Rest,
				Source.ThreeXpl_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
				Source.Zcashd_JsonRpc,
			],
			version: {},
			lockTime: {},
			sizeBytes: {},
			virtualSizeBytes: {},
			weightUnits: {},
			feeSats: {},
			isCoinbase: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	{entityId}
	title={entityId.txId}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			A UTXO transaction spends previous outputs and creates new outputs; token or shielded extensions remain chain-specific annotations.
		</p>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			value={entityId.txId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			value={entityId.txId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={transaction}
			placeholderText="Loading transaction…"
		>
			{#snippet children(transaction)}
				<dl>
					{#if transaction.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={transaction.version} /></dd>
						</div>
					{/if}

					{#if transaction.feeSats != null}
						<div>
							<dt>Fee</dt>
							<dd>{transaction.feeSats.toString()} sats</dd>
						</div>
					{/if}

					{#if transaction.sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd><NumberValue value={transaction.sizeBytes} /> bytes</dd>
						</div>
					{/if}

					{#if transaction.virtualSizeBytes != null}
						<div>
							<dt>Virtual size</dt>
							<dd><NumberValue value={transaction.virtualSizeBytes} /> vB</dd>
						</div>
					{/if}

					{#if transaction.weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={transaction.weightUnits} /> WU</dd>
						</div>
					{/if}

					{#if transaction.lockTime != null}
						<div>
							<dt>Lock time</dt>
							<dd><NumberValue value={transaction.lockTime} /></dd>
						</div>
					{/if}

					{#if transaction.isCoinbase != null}
						<div>
							<dt>Coinbase</dt>
							<dd>{transaction.isCoinbase ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
