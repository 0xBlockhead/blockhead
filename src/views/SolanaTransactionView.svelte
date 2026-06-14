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
			selector: EntitySelector<typeof schema, EntityType.SolanaTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const solanaTransaction = subscribe(EntityType.SolanaTransaction,
		selector,
		({ fields: { slot: true, feeLamports: true, computeUnitsConsumed: true, status: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	entitySelector={selector}
	title={selector.signature}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.signature}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={solanaTransaction}
			placeholderText={`Loading Solana Transaction...`}
		>
			{#snippet children(solanaTransaction)}
				<dl>
					{#if solanaTransaction.fields.slot != null}
						<div>
							<dt>Slot</dt>
							<dd><NumberValue value={solanaTransaction.fields.slot} /></dd>
						</div>
					{/if}

					{#if solanaTransaction.fields.feeLamports != null}
						<div>
							<dt>Fee Lamports</dt>
							<dd><NumberValue value={solanaTransaction.fields.feeLamports} /> lamports</dd>
						</div>
					{/if}

					{#if solanaTransaction.fields.computeUnitsConsumed != null}
						<div>
							<dt>Compute Units Consumed</dt>
							<dd><NumberValue value={solanaTransaction.fields.computeUnitsConsumed} /></dd>
						</div>
					{/if}

					{#if solanaTransaction.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{solanaTransaction.fields.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
