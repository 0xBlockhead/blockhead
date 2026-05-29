<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MoneroTransaction>
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

	const moneroTransaction = useEntity(
		EntityType.MoneroTransaction,
		entityId,
		{
			version: {},
			unlockTime: {},
			feeAtomicUnits: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroTransaction}
	{entityId}
	title={entityId.txHash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.txHash}
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
					{#if moneroTransaction.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={moneroTransaction.version} /></dd>
						</div>
					{/if}

					{#if moneroTransaction.unlockTime != null}
						<div>
							<dt>Unlock Time</dt>
							<dd><NumberValue value={moneroTransaction.unlockTime} /></dd>
						</div>
					{/if}

					{#if moneroTransaction.feeAtomicUnits != null}
						<div>
							<dt>Fee Atomic Units</dt>
							<dd><NumberValue value={moneroTransaction.feeAtomicUnits} /> atomic units</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
