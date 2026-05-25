<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]',
			{ networkId: String(entityId.$network.chainId) },
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
		?? `Validator ${entityId.validatorIndex.toLocaleString()}`
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
				<div>
					<dt>Beacon index</dt>
					<dd>
						<NumberValue value={entityId.validatorIndex} />
					</dd>
				</div>
				{#if open}
					<ResourceBoundary
						placeholderText="Loading beacon validator…"
						resource={validator}
					>
						{#snippet children(loadedValidator)}
							{#if loadedValidator.balanceGwei !== undefined}
								<div>
									<dt>Balance</dt>
									<dd>
										<NumberValue value={loadedValidator.balanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if loadedValidator.effectiveBalanceGwei !== undefined}
								<div>
									<dt>Effective balance</dt>
									<dd>
										<NumberValue value={loadedValidator.effectiveBalanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if loadedValidator.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{loadedValidator.status}</dd>
								</div>
							{/if}

							{#if loadedValidator.slashed !== undefined}
								<div>
									<dt>Slashed</dt>
									<dd>{loadedValidator.slashed ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if loadedValidator.pubkey !== undefined}
								<div>
									<dt>Pubkey</dt>
									<dd>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={loadedValidator.pubkey}
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
			Each index is a consensus validator that can propose or attest; this row comes from deduped recent beacon proposer duties near the chain head—not the full validator set.
		</p>
	{/snippet}
</EntityView>
