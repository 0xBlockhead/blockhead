<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmContract> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Blockscout_Rest,
			Source.SafeTransactionService_Rest,
		],
	}))
	const evmContract = $derived(viewSelection({
		fields: {
			precompileName: true,
		},
	}))
	const titleFallback = $derived([(prefetched.precompileName ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || 'EVM contract')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountsView from '$/views/EvmAccountsView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'
	import EvmStorageRead_TimestampsView from '$/views/EvmStorageRead_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContract}>
			{#snippet children(entity)}
				{[(entity.precompileName ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContract}>
			{#snippet children(entity)}
				{[(entity.precompileName ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmContract}
			>
				{#snippet children(entity)}
					{@const precompileName = entity.precompileName}
					{#if precompileName != null}
						<div>
							<dt>Precompile name</dt>
							<dd>
								{precompileName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$deployer}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Deployer</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$creationTransaction}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						<div>
							<dt>Creation transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$implementation}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Implementation</dt>
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
				resource={selection.$verification}
			>
				{#snippet children(evmContractVerification)}
					{#if evmContractVerification != null}
						<div>
							<dt>Verification</dt>
							<dd>
								<EvmContractVerificationView
									selection={select(EntityType.EvmContractVerification, evmContractVerification[EntityMetaKey.Selector])}
									prefetched={evmContractVerification}
									layout={EntityLayout.Value}
								/>
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
							threshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const threshold = entity.threshold}
					{#if threshold != null}
						<div>
							<dt>Threshold</dt>
							<dd>
								<NumberValue
									value={threshold}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd>
								{nonce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fallbackHandler}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Fallback handler</dt>
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
				resource={selection.$guard}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Guard</dt>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const codeHash = entity.codeHash}
					{#if codeHash != null}
						<div>
							<dt>Code hash</dt>
							<dd>
								<TruncatedValue value={codeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							code: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const code = entity.code}
					{#if code != null}
						<div>
							<dt>Code</dt>
							<dd>
								<TruncatedValue value={code} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const ownersResource = selection.$$owners}
		<ResourceBoundary
			resource={ownersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmAccountsView
						selection={ownersResource}
						countResource={ownersResource.count}
						title='Owners'
						id='owners'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const modulesResource = selection.$$modules}
		<ResourceBoundary
			resource={modulesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmContractsView
						selection={modulesResource}
						countResource={modulesResource.count}
						title='Modules'
						id='modules'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const nftsResource = selection.$$nfts}
		<ResourceBoundary
			resource={nftsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNftsView
						selection={nftsResource}
						countResource={nftsResource.count}
						title='NFTs'
						id='nfts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const storageReadsResource = selection.$$storageReads}
		<ResourceBoundary
			resource={storageReadsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmStorageRead_TimestampsView
						selection={storageReadsResource}
						countResource={storageReadsResource.count}
						title='Storage reads'
						id='storage-reads'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
