<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

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

	const withdrawal = subscribe(EntityType.BeaconWithdrawal,
		selector,
		open
			? {
					sources: [Source.Beacon_Rest],
					fields: {
						validatorIndex: true,
						$validator: true,
						$account: true,
						amountGwei: true,
					},
				}
			: { fields: {} },
	)

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
			<ResourceBoundary
				resource={withdrawal}
				placeholderText="Loading withdrawal…"
			>
				{#snippet children(withdrawal)}
					<dl data-column-item="center">
						{#if withdrawal.fields.validatorIndex !== undefined}
							<div>
								<dt>Validator index</dt>
								<dd><NumberValue value={withdrawal.fields.validatorIndex} /></dd>
							</div>
						{/if}

						{#if withdrawal.fields.$validator !== undefined}
							<div>
								<dt>Validator</dt>
								<dd>
									<BeaconValidatorView
										selector={withdrawal.fields.$validator[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if withdrawal.fields.$account !== undefined}
							<div>
								<dt>Recipient</dt>
								<dd>
									<EvmAccountView
										selector={withdrawal.fields.$account[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if withdrawal.fields.amountGwei !== undefined}
							<div>
								<dt>Amount (gwei)</dt>
								<dd><NumberValue value={withdrawal.fields.amountGwei} /></dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
