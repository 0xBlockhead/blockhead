<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadWalletAccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadWalletAccount>>
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
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account')
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
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account'}
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
				{[pendingEntity.caip10 == null ? '' : String((`${(pendingEntity.caip10).namespace}:${(pendingEntity.caip10).reference}:${(pendingEntity.caip10).accountAddress}`) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet account'}
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
							{@const caip10 = pendingEntity.caip10}
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
				{#snippet Pending()}{/snippet}

				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
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
					{@const label = pendingEntity.label}
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
							{@const capabilities = pendingEntity.capabilities}
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
					{@const namespace = pendingEntity.namespace}
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
					{@const reference = pendingEntity.reference}
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
					{@const accountAddress = pendingEntity.accountAddress}
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
					{@const addressKind = pendingEntity.addressKind}
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
					{@const canonicalAddress = pendingEntity.canonicalAddress}
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
					{@const derivationPath = pendingEntity.derivationPath}
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
					{@const publicKey = pendingEntity.publicKey}
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
