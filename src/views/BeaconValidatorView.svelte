<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]',
			{ ...caip2RouteParamsFromEvmChainId(entityId.$network.chainId) },
		),
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
	}: {
		entityId: EntityId<typeof schema, EntityType.BeaconValidator>
		href?: string
		title?: string
		open?: boolean
	} = $props()


	// Functions
	const title = (
		titleProp
		?? `Validator #${entityId.validatorIndex.toLocaleString()}`
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const validator = useEntity(
		EntityType.BeaconValidator,
		entityId,
		(
			open ?
				{
					$: [
						Source.Beacon_Rest,
					],
					balanceGwei: {},
					effectiveBalanceGwei: {},
					pubkey: {},
					slashed: {},
					status: {},
				}
			:
				{}
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator}
	{entityId}
	href={href}
	layout={EntityLayout.Summary}
	bind:open
	{title}
>
	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet Value()}
		<span>
			<NumberValue value={entityId.validatorIndex} />
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">
			<dl data-column-item="center">
				{#if open}
					<ResourceBoundary
						placeholderText="Loading beacon validator…"
						resource={validator}
					>
						{#snippet children(validator)}
							{#if validator.balanceGwei !== undefined}
								<div>
									<dt>Balance</dt>
									<dd>
										<NumberValue value={validator.balanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if validator.effectiveBalanceGwei !== undefined}
								<div>
									<dt>Effective balance</dt>
									<dd>
										<NumberValue value={validator.effectiveBalanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if validator.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{validator.status}</dd>
								</div>
							{/if}

							{#if validator.slashed !== undefined}
								<div>
									<dt>Slashed</dt>
									<dd>{validator.slashed ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if validator.pubkey !== undefined}
								<div>
									<dt>Pubkey</dt>
									<dd>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={validator.pubkey}
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each validator can propose or attest; this row comes from deduped recent beacon proposer duties near the chain head—not the full validator set.
		</p>
	{/snippet}
</EntityView>
