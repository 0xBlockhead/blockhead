<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selector,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BeaconWithdrawal>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'showTypeAnnotation'>
	> = $props()

	const withdrawal = $derived(select(
		EntityType.BeaconWithdrawal,
		selector,
		{
			sources: [
				Source.Beacon_Rest,
			],
		},
	))
	
	
	
	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconWithdrawal}
	entitySelector={selector}
	title={titleProp ?? `Withdrawal ${selector.index} in slot ${selector.slot.toLocaleString()}`}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small" data-withdrawal-index={String(selector.index)}>
			{String(selector.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal </span>
			<span data-badge="small" data-withdrawal-index={String(selector.index)}>
				{String(selector.index)}
			</span>
		</span>
	{/snippet}

	{#snippet Content()}
		{#if open}
			<dl data-column-item="center">
				<ResourceBoundary
					resource={withdrawal.validatorIndex}
					placeholderText="Loading validator index…"
				>
					{#snippet children(validatorIndex)}
						{#if validatorIndex !== undefined}
							<div>
								<dt>Validator index</dt>
								<dd><NumberValue value={validatorIndex} /></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={withdrawal.$validator}
					placeholderText="Loading validator…"
				>
					{#snippet children(validator)}
						{#if validator !== undefined}
							<div>
								<dt>Validator</dt>
								<dd>
									<BeaconValidatorView
										selector={validator.entitySelector}
										layout={EntityLayout.Title}

									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={withdrawal.$account}
					placeholderText="Loading recipient…"
				>
					{#snippet children(account)}
						{#if account !== undefined}
							<div>
								<dt>Recipient</dt>
								<dd>
									<EvmAccountView
										selector={account.entitySelector}
										layout={EntityLayout.Title}

										open={false}
										/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={withdrawal.amountGwei}
					placeholderText="Loading withdrawal amount…"
				>
					{#snippet children(amountGwei)}
						{#if amountGwei !== undefined}
							<div>
								<dt>Amount (gwei)</dt>
								<dd><NumberValue value={amountGwei} /></dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</dl>
		{/if}
	{/snippet}
</EntityView>
