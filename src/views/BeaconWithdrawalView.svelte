<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
		Pick<ComponentProps<typeof EntityView>, 'showTypeAnnotation'>
	> = $props()

	const withdrawal = useEntity(
		EntityType.BeaconWithdrawal,
		entityId,
		open
			? {
					$: [Source.Beacon_Rest],
					validatorIndex: {},
					$validator: {},
					$account: {},
					amountGwei: {},
				}
			: {},
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
	{entityId}
	title={titleProp ?? `Withdrawal ${entityId.index} in slot ${entityId.slot.toLocaleString()}`}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small" data-withdrawal-index={String(entityId.index)}>
			{String(entityId.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal </span>
			<span data-badge="small" data-withdrawal-index={String(entityId.index)}>
				{String(entityId.index)}
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
						{#if withdrawal.validatorIndex !== undefined}
							<div>
								<dt>Validator index</dt>
								<dd><NumberValue value={withdrawal.validatorIndex} /></dd>
							</div>
						{/if}

						{#if withdrawal.$validator !== undefined}
							<div>
								<dt>Validator</dt>
								<dd>
									<BeaconValidatorView
										entityId={withdrawal.$validator[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if withdrawal.$account !== undefined}
							<div>
								<dt>Recipient</dt>
								<dd>
									<EvmAccountView
										entityId={withdrawal.$account[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
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
