<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BeaconWithdrawal>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const withdrawal = useEntity(
		EntityType.BeaconWithdrawal,
		entityId,
		(
			open ?
				{
					$: [
						Source.Beacon_Rest,
					],
					validatorIndex: {},
					address: {},
					amountGwei: {},
				}
			:
				{}
		),
	)

	const title = $derived(
		titleProp
		?? `Withdrawal ${entityId.index} in slot ${entityId.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconWithdrawal}
	{entityId}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-withdrawal-index={String(entityId.index)}
		>
			{String(entityId.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		{#if open}
			<ResourceBoundary
				resource={withdrawal}
				placeholderText="Loading withdrawal…"
			>
				{#snippet children(withdrawal)}
					<dl data-column-item="center">
						{#if withdrawal.validatorIndex !== undefined}
							<div>
								<dt>Validator index</dt>
								<dd><NumberValue value={withdrawal.validatorIndex} /></dd>
							</div>
						{/if}

						{#if withdrawal.address !== undefined}
							<div>
								<dt>Recipient</dt>
								<dd>
									<TruncatedValue
										value={withdrawal.address}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if withdrawal.amountGwei !== undefined}
							<div>
								<dt>Amount (gwei)</dt>
								<dd><NumberValue value={withdrawal.amountGwei} /></dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
