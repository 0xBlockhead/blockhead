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
					{#if row.memo != null}
						<div>
							<dt>Memo</dt>
							<dd>{row.memo}</dd>
						</div>
					{/if}

					{#if row.state != null}
						<div>
							<dt>State</dt>
							<dd>{row.state}</dd>
						</div>
					{/if}

					{#if row.valueMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{row.valueMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if row.amountPaidMsat != null}
						<div>
							<dt>Paid</dt>
							<dd>{row.amountPaidMsat.toString()} msat</dd>
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
