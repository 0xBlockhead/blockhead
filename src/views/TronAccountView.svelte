<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.TronAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const account = useEntity(entityCollectionsContext, EntityType.TronAccount,
		entityId,
		({ fields: { name: true, balanceSun: true, totalTransactionCount: true, isContract: true, ...(open && ({ createdTimestampMs: true, latestOperationTimestampMs: true, bandwidthRemaining: true, energyRemaining: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronAccount}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={account}
			placeholderText="Loading TRON account..."
		>
			{#snippet children(account)}
				<dl data-column-item="center">
					{#if account.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{account.fields.name}</dd>
						</div>
					{/if}

					{#if account.fields.balanceSun != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={account.fields.balanceSun} /></dd>
						</div>
					{/if}

					{#if account.fields.totalTransactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={account.fields.totalTransactionCount} /></dd>
						</div>
					{/if}

					{#if account.fields.isContract != null}
						<div>
							<dt>Contract</dt>
							<dd>{account.fields.isContract ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && account.fields.createdTimestampMs != null}
						<div>
							<dt>Created</dt>
							<dd><Timestamp timestamp={account.fields.createdTimestampMs} /></dd>
						</div>
					{/if}

					{#if open && account.fields.latestOperationTimestampMs != null}
						<div>
							<dt>Latest operation</dt>
							<dd><Timestamp timestamp={account.fields.latestOperationTimestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
