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
			selector: EntitySelector<typeof schema, EntityType.MoneroTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const moneroTransaction = subscribe(EntityType.MoneroTransaction,
		selector,
		({ fields: { version: true, unlockTime: true, feeAtomicUnits: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroTransaction}
	entitySelector={selector}
	title={selector.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.txHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={moneroTransaction}
			placeholderText={`Loading Monero Transaction...`}
		>
			{#snippet children(moneroTransaction)}
				<dl>
					{#if moneroTransaction.fields.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={moneroTransaction.fields.version} /></dd>
						</div>
					{/if}

					{#if moneroTransaction.fields.unlockTime != null}
						<div>
							<dt>Unlock Time</dt>
							<dd><NumberValue value={moneroTransaction.fields.unlockTime} /></dd>
						</div>
					{/if}

					{#if moneroTransaction.fields.feeAtomicUnits != null}
						<div>
							<dt>Fee Atomic Units</dt>
							<dd><NumberValue value={moneroTransaction.fields.feeAtomicUnits} /> atomic units</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
