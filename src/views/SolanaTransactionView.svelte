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
			entityId: EntityId<typeof schema, EntityType.SolanaTransaction>
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

	const solanaTransaction = useEntity(
		EntityType.SolanaTransaction,
		entityId,
		{
			slot: {},
			feeLamports: {},
			computeUnitsConsumed: {},
			status: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction}
	{entityId}
	title={entityId.signature}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.signature}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			value={entityId.signature}
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
					{#if solanaTransaction.slot != null}
						<div>
							<dt>Slot</dt>
							<dd><NumberValue value={solanaTransaction.slot} /></dd>
						</div>
					{/if}

					{#if solanaTransaction.feeLamports != null}
						<div>
							<dt>Fee Lamports</dt>
							<dd><NumberValue value={solanaTransaction.feeLamports} /> lamports</dd>
						</div>
					{/if}

					{#if solanaTransaction.computeUnitsConsumed != null}
						<div>
							<dt>Compute Units Consumed</dt>
							<dd><NumberValue value={solanaTransaction.computeUnitsConsumed} /></dd>
						</div>
					{/if}

					{#if solanaTransaction.status != null}
						<div>
							<dt>Status</dt>
							<dd>{solanaTransaction.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
