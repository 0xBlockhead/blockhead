<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronAccount}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { name: true, balanceSun: true, totalTransactionCount: true, isContract: true, ...(open && ({ createdTimestampMs: true, latestOperationTimestampMs: true, bandwidthRemaining: true, energyRemaining: true })) } }),
				)}
			placeholderText="Loading TRON account..."
		>
			{#snippet children(account)}
				<dl data-column-item="center">
					{#if account.name != null}
						<div>
							<dt>Name</dt>
							<dd>{account.name}</dd>
						</div>
					{/if}

					{#if account.balanceSun != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={account.balanceSun} /></dd>
						</div>
					{/if}

					{#if account.totalTransactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={account.totalTransactionCount} /></dd>
						</div>
					{/if}

					{#if account.isContract != null}
						<div>
							<dt>Contract</dt>
							<dd>{account.isContract ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && account.createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd><Timestamp timestamp={account.createdTimestampMs} /></dd>
						</div>
					{/if}

					{#if open && account.latestOperationTimestampMs != null}
						<div>
							<dt>Latest operation</dt>
							<dd><Timestamp timestamp={account.latestOperationTimestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
