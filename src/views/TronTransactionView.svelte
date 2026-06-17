<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.TronTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronTransaction}
	entitySelector={selector}
	title={selector.transactionId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.transactionId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.TronTransaction,
					selector,
					({ fields: { blockHeight: true, timestampMs: true, contractType: true, result: true, feeSun: true, amountSun: true, assetName: true, ...(open && ({ expirationTimestampMs: true, rawDataHex: true, signatures: true })) } }),
				)}
			placeholderText="Loading TRON transaction..."
		>
			{#snippet children(transaction)}
				<dl data-column-item="center">
					{#if transaction.fields.result != null}
						<div>
							<dt>Result</dt>
							<dd>{transaction.fields.result}</dd>
						</div>
					{/if}

					{#if transaction.fields.contractType != null}
						<div>
							<dt>Contract type</dt>
							<dd>{transaction.fields.contractType}</dd>
						</div>
					{/if}

					{#if transaction.fields.blockHeight != null}
						<div>
							<dt>Block</dt>
							<dd>{transaction.fields.blockHeight.toString()}</dd>
						</div>
					{/if}

					{#if transaction.fields.amountSun != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={transaction.fields.amountSun} /></dd>
						</div>
					{/if}

					{#if transaction.fields.feeSun != null}
						<div>
							<dt>Fee</dt>
							<dd><NumberValue value={transaction.fields.feeSun} /></dd>
						</div>
					{/if}

					{#if transaction.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={transaction.fields.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && transaction.fields.rawDataHex != null}
						<div>
							<dt>Raw data</dt>
							<dd>
								<TruncatedValue
									value={transaction.fields.rawDataHex}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
