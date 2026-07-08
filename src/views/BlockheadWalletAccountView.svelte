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
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWalletAccount>>
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
	const blockheadWalletAccount = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			address: true,
			label: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((prefetched.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account')
	const viewDomId = $derived('blockhead-wallet-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletAccount}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletAccount}>
			{#snippet Pending()}
				{[selection.entitySelector.caip10 ?? prefetched.caip10 == null ? '' : String((`${(selection.entitySelector.caip10 ?? prefetched.caip10).namespace}:${(selection.entitySelector.caip10 ?? prefetched.caip10).reference}:${(selection.entitySelector.caip10 ?? prefetched.caip10).accountAddress}`) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[resolvedEntity.caip10 == null ? '' : String((`${(resolvedEntity.caip10).namespace}:${(resolvedEntity.caip10).reference}:${(resolvedEntity.caip10).accountAddress}`) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CAIP-10</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									caip10: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const caip10 = selection.entitySelector.caip10 ?? prefetched.caip10}
							{#if caip10 !== undefined && caip10 !== null}
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const caip10 = resolvedEntity.caip10}
							{#if caip10 !== undefined && caip10 !== null}
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('CosmosSdk') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('Evm') && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
											networkSlug: String(networkByCaip2[String(String(network[EntityMetaKey.Selector].caip2.namespace) + ':' + String(network[EntityMetaKey.Selector].caip2.reference))].slug ?? ''),
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('SolanaRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].executionModels !== undefined && network[EntityMetaKey.Selector].executionModels.values.includes('PolkadotRuntime') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].ledgerModels !== undefined && network[EntityMetaKey.Selector].ledgerModels.values.includes('Utxo') && network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
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
							{@const address = prefetched.address}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>capabilities</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									capabilities: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const capabilities = prefetched.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const capabilities = resolvedEntity.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							namespace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const namespace = prefetched.namespace}
					{#if namespace !== undefined && namespace !== null}
						<div>
							<dt>Namespace</dt>
							<dd>
								{String((namespace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const namespace = resolvedEntity.namespace}
					{#if namespace !== undefined && namespace !== null}
						<div>
							<dt>Namespace</dt>
							<dd>
								{String((namespace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reference: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reference = prefetched.reference}
					{#if reference !== undefined && reference !== null}
						<div>
							<dt>Reference</dt>
							<dd>
								{String((reference) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reference = resolvedEntity.reference}
					{#if reference !== undefined && reference !== null}
						<div>
							<dt>Reference</dt>
							<dd>
								{String((reference) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountAddress = prefetched.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountAddress = resolvedEntity.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addressKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const addressKind = prefetched.addressKind}
					{#if addressKind !== undefined && addressKind !== null}
						<div>
							<dt>address kind</dt>
							<dd>
								<TruncatedValue value={String((addressKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addressKind = resolvedEntity.addressKind}
					{#if addressKind !== undefined && addressKind !== null}
						<div>
							<dt>address kind</dt>
							<dd>
								<TruncatedValue value={String((addressKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canonicalAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canonicalAddress = prefetched.canonicalAddress}
					{#if canonicalAddress !== undefined && canonicalAddress !== null}
						<div>
							<dt>canonical address</dt>
							<dd>
								<TruncatedValue value={String((canonicalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canonicalAddress = resolvedEntity.canonicalAddress}
					{#if canonicalAddress !== undefined && canonicalAddress !== null}
						<div>
							<dt>canonical address</dt>
							<dd>
								<TruncatedValue value={String((canonicalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							derivationPath: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const derivationPath = prefetched.derivationPath}
					{#if derivationPath !== undefined && derivationPath !== null}
						<div>
							<dt>derivation path</dt>
							<dd>
								{String((derivationPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const derivationPath = resolvedEntity.derivationPath}
					{#if derivationPath !== undefined && derivationPath !== null}
						<div>
							<dt>derivation path</dt>
							<dd>
								{String((derivationPath) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = prefetched.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
