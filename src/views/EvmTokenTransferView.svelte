<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { EvmTokenStandard } from '$/schema/EvmTokenTransfer.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children: _children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		showParentTransaction = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmTokenTransfer>
			href: string
			layout?: EntityLayout
			open?: boolean
			showParentTransaction?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transfer = useEntity(
		EntityType.EvmTokenTransfer,
		entityId,
		{
			$: [Source.Blockscout_Rest],
			standard: {},
			amount: {},
			tokenSymbol: {},
			...(open && {
				tokenId: {},
				tokenDecimals: {},
				tokenName: {},
				logIndex: {},
				$from: {},
				$to: {},
				$tokenContract: {},
				$coinInstance: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTokenTransfer}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={transfer}
			placeholderText="Loading token transfer…"
		>
					</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Token movement parsed from a receipt log (<code>Transfer</code>, <code>TransferSingle</code>, or indexer-classified ERC-20/721/1155 row).
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={transfer}
				placeholderText="Loading token transfer…"
			>
							{#snippet children(transfer)}
				
					{#if showParentTransaction}
						<div>
							<dt>Transaction</dt>
							<dd>
								<a
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
										{
											networkId: String(entityId.$network.chainId),
											transactionId: entityId.txHash,
										},
									)}
								>
									<TruncatedValue
										value={entityId.txHash}
										format={TruncatedValueFormat.Abbr}
									/>
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Standard</dt>
						<dd>{transfer.standard}</dd>
					</div>

					{#if transfer.logIndex !== undefined}
						<div>
							<dt>Log index</dt>
							<dd>{String(transfer.logIndex)}</dd>
						</div>
					{/if}

					{#if transfer.$coinInstance}
						<div>
							<dt>Token</dt>
							<dd>
								<CoinInstanceView
									entityId={transfer.$coinInstance[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
										{
											chainId: String(transfer.$coinInstance[EntityMetaKey.Id].$network.chainId),
											coinInstanceSlug: stringify(transfer.$coinInstance[EntityMetaKey.Id]),
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{:else if transfer.$tokenContract}
						<div>
							<dt>Token contract</dt>
							<dd>
								<EvmContractView
									entityId={transfer.$tokenContract[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
										{
											networkId: String(entityId.$network.chainId),
											address: transfer.$tokenContract[EntityMetaKey.Id].address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>
					{/if}
				
			{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmTokenTransfer}
			{entityId}
		/>
	{/snippet}
</EntityView>
