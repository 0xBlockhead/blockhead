<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { LightningPaymentStatus } from '$/schema/LightningPayment.ts'
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
			entityId: EntityId<typeof schema, EntityType.LightningPayment>
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

	const payment = useEntity(
		EntityType.LightningPayment,
		entityId,
		{
			$: [
				Source.LightningLnd_Rest,
			],
			valueMsat: {},
			feeMsat: {},
			status: {},
			failureReason: {},
			paymentRequest: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningPayment}
	{entityId}
	title={entityId.paymentHash}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={entityId.paymentHash}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Lightning payment is an off-chain payment attempt identified by payment hash; it is not a Bitcoin transaction.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={payment}
			placeholderText="Loading payment…"
		>
			{#snippet children(row)}
				<dl>
					{#if row.status != null}
						<div>
							<dt>Status</dt>
							<dd>{row.status === LightningPaymentStatus.InFlight ? 'In Flight' : row.status}</dd>
						</div>
					{/if}

					{#if row.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{row.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if row.feeMsat != null}
						<div>
							<dt>Fee</dt>
							<dd>{row.feeMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if row.failureReason != null}
						<div>
							<dt>Failure</dt>
							<dd>{row.failureReason}</dd>
						</div>
					{/if}

					{#if row.paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue
									value={row.paymentRequest}
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
