<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		id,
		open = true,
	}: {
		entityId: EntityId<typeof schema, EntityType.EvmTransaction>
		href: string
		id: string
		open?: boolean
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
						$: [Source.Blockscout_Rest],
					},
					$$internalTransfers: {
						$: [Source.Blockscout_Rest],
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
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
								{
									networkId: String(entityId.$network.chainId),
									address: evmTransaction.$from[EntityMetaKey.Id].address,
								},
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
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
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
								{
									networkId: String(entityId.$network.chainId),
									address: evmTransaction.$to[EntityMetaKey.Id].address,
								},
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{/if}
				</div>
			{/if}

			<EvmInternalTransfersView
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					entityId,
					fieldName: '$$internalTransfers',
				}}
				{href}
				id={`${id}:internal-transfers`}
				collapsible={false}
				title="Internal native transfers"
			/>

			<EvmTokenTransfersView
				entityFieldReference={{
					entityType: EntityType.EvmTransaction,
					entityId,
					fieldName: '$$tokenTransfers',
				}}
				{href}
				id={`${id}:token-transfers`}
				collapsible={false}
			/>
		{/snippet}
	</ResourceBoundary>
</section>
