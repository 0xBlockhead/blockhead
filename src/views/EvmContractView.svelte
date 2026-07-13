<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmContract>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmContract>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmContract = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Blockscout_Rest,
		],
		fields: {
			precompileName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.precompileName) ?? ''), String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'EVM contract')
	const viewDomId = $derived('evm-contract-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmStorageRead_TimestampsView from '$/views/EvmStorageRead_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContract}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
			network: String(pendingEntity.$network.slug ?? ''),
			address: String(pendingEntity.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContract}>
			{#snippet Pending()}
				{[String((pendingEntity.precompileName) ?? ''), String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.precompileName) ?? ''), String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContract}>
			{#snippet Pending()}
				{[String((pendingEntity.precompileName) ?? ''), String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.precompileName) ?? ''), String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmContract}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A smart contract account and its contract-specific metadata on an EVM-compatible network.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							precompileName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const precompileName = pendingEntity.precompileName}
					{#if precompileName !== undefined && precompileName !== null}
						<div>
							<dt>Precompile name</dt>
							<dd>
								{String((precompileName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const precompileName = resolvedEntity.precompileName}
					{#if precompileName !== undefined && precompileName !== null}
						<div>
							<dt>Precompile name</dt>
							<dd>
								{String((precompileName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const address = pendingEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$deployer}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Deployer</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$creationTransaction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmTransaction)}
					{#if evmTransaction != null && evmTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Creation transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, evmTransaction[EntityMetaKey.Selector])}
									prefetched={evmTransaction}
									href={
										(evmTransaction[EntityMetaKey.Selector].$network !== undefined && evmTransaction[EntityMetaKey.Selector].$network.slug !== undefined && evmTransaction[EntityMetaKey.Selector].txHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
											network: String(evmTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
											transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$implementation}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Implementation</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$verification}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContractVerification)}
					{#if evmContractVerification != null && evmContractVerification[EntityMetaKey.Selector] != null}
						<div>
							<dt>Verification</dt>
							<dd>
								<EvmContractVerificationView
									selection={select(EntityType.EvmContractVerification, evmContractVerification[EntityMetaKey.Selector])}
									prefetched={evmContractVerification}
									href={
										(evmContractVerification[EntityMetaKey.Selector].$contract !== undefined && evmContractVerification[EntityMetaKey.Selector].$contract.$network !== undefined && evmContractVerification[EntityMetaKey.Selector].$contract.$network.slug !== undefined && evmContractVerification[EntityMetaKey.Selector].$contract.address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
											network: String(evmContractVerification[EntityMetaKey.Selector].$contract.$network.slug ?? ''),
											address: String(evmContractVerification[EntityMetaKey.Selector].$contract.address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
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
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeHash = pendingEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>Code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeHash = resolvedEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>Code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							code: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const code = pendingEntity.code}
					{#if code !== undefined && code !== null}
						<div>
							<dt>Code</dt>
							<dd>
								<TruncatedValue value={String((code) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const code = resolvedEntity.code}
					{#if code !== undefined && code !== null}
						<div>
							<dt>Code</dt>
							<dd>
								<TruncatedValue value={String((code) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmStorageRead_TimestampsView
				selection={selection.$$storageReads}
				title='Storage reads'
				emptyText='No EVM storage reads.'
				id='EvmStorageRead_TimestampsView-storage-reads'
			/>
		{/if}
	{/snippet}
</EntityView>
