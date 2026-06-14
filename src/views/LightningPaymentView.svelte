<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { LightningPaymentStatus } from '$/schema/LightningPayment.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LightningPayment>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const payment = subscribe(EntityType.LightningPayment,
		selector,
		({ sources: [
				Source.LightningLnd_Rest,
			], fields: { valueMsat: true, feeMsat: true, status: true, failureReason: true, paymentRequest: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningPayment}
	entitySelector={selector}
	title={selector.paymentHash}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.paymentHash}
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
			{#snippet children(lightningPayment)}
				<dl>
					{#if lightningPayment.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{lightningPayment.fields.status === LightningPaymentStatus.InFlight ? 'In Flight' : lightningPayment.fields.status}</dd>
						</div>
					{/if}

					{#if lightningPayment.fields.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{lightningPayment.fields.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningPayment.fields.feeMsat != null}
						<div>
							<dt>Fee</dt>
							<dd>{lightningPayment.fields.feeMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningPayment.fields.failureReason != null}
						<div>
							<dt>Failure</dt>
							<dd>{lightningPayment.fields.failureReason}</dd>
						</div>
					{/if}

					{#if lightningPayment.fields.paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue
									value={lightningPayment.fields.paymentRequest}
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
