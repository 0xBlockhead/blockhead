<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		id,
		open = true,
		CollapsibleProps = {},
	}: {
		entityId: EntityId<typeof schema, EntityType.EvmTransaction>
		id: string
		open?: boolean
		CollapsibleProps?: ComponentProps<typeof EvmInternalTransfersView>['CollapsibleProps']
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const evmTransaction = useEntity(
		EntityType.EvmTransaction,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
				Source.Voltaire_JsonRpc,
			],
			value: {},
			$from: {},
			$to: {},
			...(open ?
				{
					$$tokenTransfers: {
						$: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						],
					},
					$$internalTransfers: {
						$: [
							Source.Blockscout_Rest,
							Source.Voltaire_JsonRpc,
						],
					},
				}
			:
				{}),
		},
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<section data-column="gap-2">
	<ResourceBoundary
		resource={evmTransaction}
		placeholderText="Loading asset movements…"
	>
		{#snippet children(evmTransaction)}
			{#if evmTransaction.value !== undefined && evmTransaction.value > 0n}
				<div data-row="wrap gap-2 align-baseline">
					<span data-text="annotation">Signed envelope</span>
					{#if evmTransaction.$from?.[EntityMetaKey.Id].address !== undefined}
						<ActorNetworkView
							entityId={{
								$network: entityId.$network,
								$actor: evmTransaction.$from[EntityMetaKey.Id],
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
					<span data-text="muted">sent</span>
					<NumberValue value={evmTransaction.value} />
					<span data-text="muted">to</span>
					{#if evmTransaction.$to?.[EntityMetaKey.Id].address !== undefined}
						<ActorNetworkView
							entityId={{
								$network: entityId.$network,
								$actor: evmTransaction.$to[EntityMetaKey.Id],
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/if}
				</div>
			{/if}

			<EvmInternalTransfersView
				{CollapsibleProps}
				href={resolve(
					'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]',
					{
					...caip2RouteParamsFromNetworkId(entityId.$network),
					transactionId: entityId.txHash,
					},
		)}
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					entityId,
					fieldName: '$$internalTransfers',
				}}
				id={`${id}:internal-transfers`}
				collapsible={false}
				title="Internal native transfers"
			/>
			<EvmTokenTransfersView
				{CollapsibleProps}
				href={resolve(
					'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(transactions)/tx/[transactionId]',
					{
					...caip2RouteParamsFromNetworkId(entityId.$network),
					transactionId: entityId.txHash,
					},
		)}
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					entityId,
					fieldName: '$$tokenTransfers',
				}}
				id={`${id}:token-transfers`}
				collapsible={false}
			/>
		{/snippet}
	</ResourceBoundary>
</section>

