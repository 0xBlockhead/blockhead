<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			entityId: EntityId<typeof schema, EntityType.LightningInvoice>
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

	const invoice = useEntity(
		EntityType.LightningInvoice,
		entityId,
		{
			$: [
				Source.LightningLnd_Rest,
			],
			memo: {},
			valueMsat: {},
			amountPaidMsat: {},
			state: {},
			paymentRequest: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningInvoice}
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

	{#snippet Content()}
		<ResourceBoundary
			resource={invoice}
			placeholderText="Loading invoice…"
		>
			{#snippet children(row)}
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
