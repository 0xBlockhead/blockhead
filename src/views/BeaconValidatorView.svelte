<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'

	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		title: titleProp,
		open = $bindable(true),
		Title,
	}: {
		entityId: EntityId<typeof schema, EntityType.BeaconValidator>
		title?: string
		open?: boolean
		Title?: Snippet
	} = $props()


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
	layout={EntityLayout.Summary}
	bind:open
	{title}
>
	{#snippet Heading()}
		{#if Title}
			{@render Title()}
		{:else}
			{title}
		{/if}
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			<NumberValue value={entityId.validatorIndex} />
		</span>
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
						{#snippet children(live)}
							{#if live.balanceGwei !== undefined}
								<div>
									<dt>Balance</dt>
									<dd>
										<NumberValue value={live.balanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if live.effectiveBalanceGwei !== undefined}
								<div>
									<dt>Effective balance</dt>
									<dd>
										<NumberValue value={live.effectiveBalanceGwei} />
										gwei
									</dd>
								</div>
							{/if}

							{#if live.status !== undefined}
								<div>
									<dt>Status</dt>
									<dd>{live.status}</dd>
								</div>
							{/if}

							{#if live.slashed !== undefined}
								<div>
									<dt>Slashed</dt>
									<dd>{live.slashed ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if live.pubkey !== undefined}
								<div>
									<dt>Pubkey</dt>
									<dd>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={live.pubkey}
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
