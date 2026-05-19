<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { resolve } from '$app/paths'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import ContractView from '$/views/ContractView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'


	// Props
	let {
		entityId,

		layout = EntityLayout.Summary,

		open = $bindable(layout === EntityLayout.SummaryDetails),

		title = 'User operation',

		HeadingSnippet,

		...entityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmUserOperation>

			layout?: EntityLayout

			open?: boolean

			title?: string

			HeadingSnippet?: Snippet
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'Heading'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	// State
	const operation = useEntity(
		EntityType.EvmUserOperation,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
			],
			bundledTransactionHash: {},
			$sender: {},
			blockNumber: {},
			timestampSeconds: {},
			finalized: {},
			fee: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.EvmUserOperation}
	{entityId}
	{layout}
	bind:open
	{title}
	{...entityViewProps}
>
	{#snippet Heading()}
		{#if HeadingSnippet}
			{@render HeadingSnippet()}
		{:else}
			<TruncatedValue
				format={TruncatedValueFormat.Visual}
				value={entityId.hash}
			/>
		{/if}
	{/snippet}

	{#snippet Id()}
		<TruncatedValue
			format={TruncatedValueFormat.Abbr}
			value={entityId.hash}
		/>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading user operation…"
			resource={operation}
		>
			{#snippet children(operation)}
				<dl data-column-item="center">
					<div>
						<dt>Operation hash</dt>
						<dd>
							<TruncatedValue
								format={TruncatedValueFormat.Visual}
								value={entityId.hash}
							/>
						</dd>
					</div>

					{#if operation.finalized !== undefined}
						<div>
							<dt>Finalized</dt>
							<dd>{String(operation.finalized)}</dd>
						</div>
					{/if}

					{#if operation.blockNumber !== undefined}
						<div>
							<dt>Bundled block</dt>
							<dd>{String(operation.blockNumber)}</dd>
						</div>
					{/if}

					{#if operation.fee != null && operation.fee !== ''}
						<div>
							<dt>Fee</dt>
							<dd>{operation.fee}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<ResourceBoundary resource={operation}>
			{#snippet children(operation)}
				<div class="entity-details" data-column="gap-2">
					{#if operation.bundledTransactionHash != null}
						<EvmTransactionView
							entityId={{
								$network: entityId.$network,
								txHash: operation.bundledTransactionHash,
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
									networkId: String(entityId.$network.chainId),
									transactionId: operation.bundledTransactionHash,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/if}

					{#if operation.$sender != null}
						<ContractView
							entityId={operation.$sender[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
								{
									networkId: String(entityId.$network.chainId),
									address: operation.$sender[EntityMetaKey.Id].address,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							title="Sender contract"
						/>
					{/if}
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			User operations carry calldata and gas limits for ERC-4337 accounts; bundlers submit them on-chain as a single transaction through the EntryPoint contract.
		</p>
	{/snippet}
</EntityView>
