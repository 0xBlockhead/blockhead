<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadActionDispatchOccurrence>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadActionDispatchOccurrence = $derived(viewSelection({
		fields: {
			startedAt: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import XrplTransactionsView from '$/views/XrplTransactionsView.svelte'
	import CosmosTransactionsView from '$/views/CosmosTransactionsView.svelte'
	import BlockheadActionAuthorityRequestView from '$/views/BlockheadActionAuthorityRequestView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionDispatchOccurrence}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.id || 'dispatch occurrence')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionDispatchOccurrence}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.startedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>id</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$authorityRequest}
			>
				{#snippet children(blockheadActionAuthorityRequest)}
					{#if blockheadActionAuthorityRequest != null}
						<div>
							<dt>authority request</dt>
							<dd>
								<BlockheadActionAuthorityRequestView
									selection={select(EntityType.BlockheadActionAuthorityRequest, blockheadActionAuthorityRequest[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$walletConnection}
			>
				{#snippet children(blockheadWalletConnection)}
					{#if blockheadWalletConnection != null}
						<div>
							<dt>wallet connection</dt>
							<dd>
								<BlockheadWalletConnectionView
									selection={select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>started at</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionDispatchOccurrence}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.startedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							localEffectFingerprint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const localEffectFingerprint = entity.localEffectFingerprint}
					{#if localEffectFingerprint != null}
						<div>
							<dt>local effect fingerprint</dt>
							<dd>
								{localEffectFingerprint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							evidence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidence = entity.evidence}
					{#if evidence != null}
						<div>
							<dt>evidence</dt>
							<dd>
								{evidence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const evmTransactionsResource = selection.$$evmTransactions}
		<ResourceBoundary
			resource={evmTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTransactionsView
						selection={evmTransactionsResource}
						countResource={evmTransactionsResource.count}
						title='EVM transactions'
						id='evm-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const xrplTransactionsResource = selection.$$xrplTransactions}
		<ResourceBoundary
			resource={xrplTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<XrplTransactionsView
						selection={xrplTransactionsResource}
						countResource={xrplTransactionsResource.count}
						title='XRPL transactions'
						id='xrpl-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const cosmosTransactionsResource = selection.$$cosmosTransactions}
		<ResourceBoundary
			resource={cosmosTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CosmosTransactionsView
						selection={cosmosTransactionsResource}
						countResource={cosmosTransactionsResource.count}
						title='Cosmos transactions'
						id='cosmos-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
