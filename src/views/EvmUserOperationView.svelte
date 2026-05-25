<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/user-operation/[userOperationHash]',
		{
			networkId: String(entityId.$network.chainId),
			userOperationHash: entityId.hash,
		},
	),

		layout = EntityLayout.SummaryDetails,

		summaryUsesHeading = (
			layout === EntityLayout.SummaryDetails
			|| layout === EntityLayout.Details
		),

		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),

		title = 'User operation',

		HeadingSnippet,

		...entityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmUserOperation>
			href?: string
			layout?: EntityLayout

			summaryUsesHeading?: boolean

			open?: boolean

			title?: string

			HeadingSnippet?: Snippet
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmUserOperation}
	{entityId}
	href={href}
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

	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Abbr}
			value={entityId.hash}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if !summaryUsesHeading}
				<div>
					<dt>Operation hash</dt>
					<dd>
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={entityId.hash}
						/>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Finalized</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(loadedOperation)}
							{#if loadedOperation.finalized !== undefined}
								{String(operation.finalized)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Bundled block</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(loadedOperation)}
							{#if loadedOperation.blockNumber !== undefined}
								{String(operation.blockNumber)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Fee</dt>
				<dd>
					<ResourceBoundary
						placeholderText="Loading user operation…"
						resource={operation}
					>
						{#snippet children(loadedOperation)}
							{#if loadedOperation.fee != null && loadedOperation.fee !== ''}
								{loadedOperation.fee}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<ResourceBoundary resource={operation}>
			{#snippet children(loadedOperation)}
				<div class="entity-details" data-column="gap-2">
					{#if loadedOperation.bundledTransactionHash != null}
						<EvmTransactionView
							entityId={{
								$network: entityId.$network,
								txHash: loadedOperation.bundledTransactionHash,
							}}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
								networkId: String(entityId.$network.chainId),
								transactionId: loadedOperation.bundledTransactionHash,
								},
							)}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
						/>
					{/if}

					{#if loadedOperation.$sender != null}
						<Erc4337SmartAccountView
							entityId={loadedOperation.$sender[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							collapsible={false}
							showTypeAnnotation={false}
							title="Sender smart account"
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
