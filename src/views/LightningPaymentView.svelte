<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { LightningPaymentStatus } from '$/schema/LightningPayment.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LightningPayment>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningPayment}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.paymentHash}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.paymentHash}
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
			resource={selection(
		({ sources: [
				Source.LightningLnd_Rest,
			], fields: { valueMsat: true, feeMsat: true, status: true, failureReason: true, paymentRequest: true } }),
	)}
			placeholderText="Loading payment…"
		>
			{#snippet children(lightningPayment)}
				<dl>
					{#if lightningPayment.status != null}
						<div>
							<dt>Status</dt>
							<dd>{lightningPayment.status === LightningPaymentStatus.InFlight ? 'In Flight' : lightningPayment.status}</dd>
						</div>
					{/if}

					{#if lightningPayment.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{lightningPayment.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningPayment.feeMsat != null}
						<div>
							<dt>Fee</dt>
							<dd>{lightningPayment.feeMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningPayment.failureReason != null}
						<div>
							<dt>Failure</dt>
							<dd>{lightningPayment.failureReason}</dd>
						</div>
					{/if}

					{#if lightningPayment.paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue
									value={lightningPayment.paymentRequest}
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
