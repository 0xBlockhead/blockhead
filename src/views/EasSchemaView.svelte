<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EasSchema> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
			Source.EasContracts_Evm,
			Source.EasScan_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const easSchema = $derived(viewSelection({
		fields: {
			schema: true,
			resolver: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.schemaUid || 'EAS schema')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EasAttestationsView from '$/views/EasAttestationsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EasSchema}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={easSchema}>
			{#snippet children(entity)}
				{entity.schema || selection.entitySelector.schemaUid || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={easSchema}>
			{#snippet children(entity)}
				{@const resolver = entity.resolver}
				{#if resolver != null}
					<span data-text="muted">
						{resolver}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Schema UID</dt>
				<dd>
					{selection.entitySelector.schemaUid}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Schema</dt>
				<dd>
					<ResourceBoundary
						resource={easSchema}
					>
						{#snippet children(entity)}
							{entity.schema}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={easSchema}
			>
				{#snippet children(entity)}
					{@const resolver = entity.resolver}
					{#if resolver != null}
						<div>
							<dt>Resolver</dt>
							<dd>
								{resolver}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							revocable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revocable = entity.revocable}
					{#if revocable != null}
						<div>
							<dt>Revocable</dt>
							<dd>
								{revocable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							registerer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registerer = entity.registerer}
					{#if registerer != null}
						<div>
							<dt>Registerer</dt>
							<dd>
								{registerer}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							registeredAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registeredAt = entity.registeredAt}
					{#if registeredAt != null}
						<div>
							<dt>Registered at</dt>
							<dd>
								<Timestamp timestamp={registeredAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							registeredTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registeredTransactionHash = entity.registeredTransactionHash}
					{#if registeredTransactionHash != null}
						<div>
							<dt>Registered transaction hash</dt>
							<dd>
								<TruncatedValue value={registeredTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							registeredLogIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registeredLogIndex = entity.registeredLogIndex}
					{#if registeredLogIndex != null}
						<div>
							<dt>Registered log index</dt>
							<dd>
								<NumberValue
									value={registeredLogIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resolverContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Resolver contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$registererAccount}
			>
				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null}
						<div>
							<dt>Registerer account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const attestationsResource = selection.$$attestations}
		<ResourceBoundary
			resource={attestationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EasAttestationsView
						selection={attestationsResource}
						countResource={attestationsResource.count}
						title='Attestations'
						id='attestations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
