<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningInvoice>
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
	entityType={EntityType.LightningInvoice}
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

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
		({ sources: [
				Source.LightningLnd_Rest,
			], fields: { memo: true, valueMsat: true, amountPaidMsat: true, state: true, paymentRequest: true } }),
	)}
			placeholderText="Loading invoice…"
		>
			{#snippet children(lightningInvoice)}
				<dl>
					{#if lightningInvoice.memo != null}
						<div>
							<dt>Memo</dt>
							<dd>{lightningInvoice.memo}</dd>
						</div>
					{/if}

					{#if lightningInvoice.state != null}
						<div>
							<dt>State</dt>
							<dd>{lightningInvoice.state}</dd>
						</div>
					{/if}

					{#if lightningInvoice.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{lightningInvoice.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningInvoice.amountPaidMsat != null}
						<div>
							<dt>Paid</dt>
							<dd>{lightningInvoice.amountPaidMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if lightningInvoice.paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue
									value={lightningInvoice.paymentRequest}
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
