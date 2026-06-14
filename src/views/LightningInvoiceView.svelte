<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selector: EntitySelector<typeof schema, EntityType.LightningInvoice>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const invoice = subscribe(EntityType.LightningInvoice,
		selector,
		({ sources: [
				Source.LightningLnd_Rest,
			], fields: { memo: true, valueMsat: true, amountPaidMsat: true, state: true, paymentRequest: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningInvoice}
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

	{#snippet Content()}
		<ResourceBoundary
			resource={invoice}
			placeholderText="Loading invoice…"
		>
			{#snippet children(lightningInvoice)}
				<dl>
					{#if lightningInvoice.fields.memo != null}
						<div>
							<dt>Memo</dt>
							<dd>{lightningInvoice.fields.memo}</dd>
						</div>
					{/if}

					{#if lightningInvoice.fields.state != null}
						<div>
							<dt>State</dt>
							<dd>{lightningInvoice.fields.state}</dd>
						</div>
					{/if}

					{#if lightningInvoice.fields.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{lightningInvoice.fields.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningInvoice.fields.amountPaidMsat != null}
						<div>
							<dt>Paid</dt>
							<dd>{lightningInvoice.fields.amountPaidMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningInvoice.fields.paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue
									value={lightningInvoice.fields.paymentRequest}
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
