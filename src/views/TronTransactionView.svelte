<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronTransaction>
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
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.transactionId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.transactionId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { blockHeight: true, timestampMs: true, contractType: true, result: true, feeSun: true, amountSun: true, assetName: true, ...(open && ({ expirationTimestampMs: true, rawDataHex: true, signatures: true })) } }),
				)}
			placeholderText="Loading TRON transaction..."
		>
			{#snippet children(transaction)}
				<dl data-column-item="center">
					{#if transaction.result != null}
						<div>
							<dt>Result</dt>
							<dd>{transaction.result}</dd>
						</div>
					{/if}

					{#if transaction.contractType != null}
						<div>
							<dt>Contract type</dt>
							<dd>{transaction.contractType}</dd>
						</div>
					{/if}

					{#if transaction.blockHeight != null}
						<div>
							<dt>Block</dt>
							<dd>{transaction.blockHeight.toString()}</dd>
						</div>
					{/if}

					{#if transaction.amountSun != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={transaction.amountSun} /></dd>
						</div>
					{/if}

					{#if transaction.feeSun != null}
						<div>
							<dt>Fee</dt>
							<dd><NumberValue value={transaction.feeSun} /></dd>
						</div>
					{/if}

					{#if transaction.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={transaction.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && transaction.rawDataHex != null}
						<div>
							<dt>Raw data</dt>
							<dd>
								<TruncatedValue
									value={transaction.rawDataHex}
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
