<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
		}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BeaconValidator>
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const title = (
		titleProp
		?? `Validator #${selector.validatorIndex.toLocaleString()}`
	)


	const validator = subscribe(EntityType.BeaconValidator,
		selector,
		{
			sources: [
				Source.Beacon_Rest,
			],
			fields: {
				balanceGwei: true,
				effectiveBalanceGwei: true,
				pubkey: true,
				slashed: true,
				status: true,
			},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator}
	entitySelector={selector}
	href={href}
		{layout}
	bind:open
	{title}
		{collapsible}
		{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selector.validatorIndex)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Validator </span>
		<span data-badge="small">
			#{String(selector.validatorIndex)}
		</span>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each validator can propose or attest; this row comes from deduped recent beacon proposer duties near the chain head—not the full validator set.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">
			<dl data-column-item="center">
				{#if open}
					<ResourceBoundary
						placeholderText="Loading beacon validator…"
						resource={validator}
					>
						{#snippet children(validator)}
							{#if validator.fields.balanceGwei !== undefined}
								<div>
									<dt>Balance</dt>
									<dd>
										<NumberValue value={validator.fields.balanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if validator.fields.effectiveBalanceGwei !== undefined}
								<div>
									<dt>Effective balance</dt>
									<dd>
										<NumberValue value={validator.fields.effectiveBalanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if validator.fields.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{validator.fields.status}</dd>
								</div>
							{/if}

							{#if validator.fields.slashed !== undefined}
								<div>
									<dt>Slashed</dt>
									<dd>{validator.fields.slashed ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if validator.fields.pubkey !== undefined}
								<div>
									<dt>Pubkey</dt>
									<dd>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={validator.fields.pubkey}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}
</EntityView>
