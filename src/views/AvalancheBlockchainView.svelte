<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheBlockchain>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalancheBlockchain>>
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
	const avalancheBlockchain = $derived(selection({
		fields: {
			chainName: true,
			chainAlias: true,
			vmId: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.chainName) ?? ''), String((prefetched.chainAlias) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.blockchainId ?? prefetched.blockchainId) ?? '')].filter(Boolean).join(' ') || 'avalanche blockchain')
	const viewDomId = $derived('avalanche-blockchain-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheSubnetView from '$/views/AvalancheSubnetView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheBlockchain}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalancheBlockchain}>
			{#snippet Pending()}
				{[String((prefetched.chainName) ?? ''), String((prefetched.chainAlias) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.blockchainId ?? prefetched.blockchainId) ?? '')].filter(Boolean).join(' ') || 'avalanche blockchain'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.chainName) ?? ''), String((resolvedEntity.chainAlias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheBlockchain}>
			{#snippet Pending()}
				{[String((prefetched.vmId) ?? '')].filter(Boolean).join(' ') || [String((prefetched.chainName) ?? ''), String((prefetched.chainAlias) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.blockchainId ?? prefetched.blockchainId) ?? '')].filter(Boolean).join(' ') || 'avalanche blockchain'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.vmId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.chainName) ?? ''), String((resolvedEntity.chainAlias) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>blockchain ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockchainId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockchainId = selection.entitySelector.blockchainId ?? prefetched.blockchainId}
							{#if blockchainId !== undefined && blockchainId !== null}
								<TruncatedValue value={String((blockchainId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockchainId = resolvedEntity.blockchainId}
							{#if blockchainId !== undefined && blockchainId !== null}
								<TruncatedValue value={String((blockchainId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>subnet</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.AvalancheSubnet, false>('$subnet')}
					>
						{#snippet children(avalancheSubnet)}
							{#if avalancheSubnet[EntityMetaKey.Selector] != null}
								<AvalancheSubnetView
									selection={select(EntityType.AvalancheSubnet, avalancheSubnet[EntityMetaKey.Selector])}
									prefetched={avalancheSubnet}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>vm ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									vmId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const vmId = prefetched.vmId}
							{#if vmId !== undefined && vmId !== null}
								{String((vmId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const vmId = resolvedEntity.vmId}
							{#if vmId !== undefined && vmId !== null}
								{String((vmId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainName = prefetched.chainName}
					{#if chainName !== undefined && chainName !== null}
						<div>
							<dt>chain name</dt>
							<dd>
								{String((chainName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainName = resolvedEntity.chainName}
					{#if chainName !== undefined && chainName !== null}
						<div>
							<dt>chain name</dt>
							<dd>
								{String((chainName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainAlias: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainAlias = prefetched.chainAlias}
					{#if chainAlias !== undefined && chainAlias !== null}
						<div>
							<dt>chain alias</dt>
							<dd>
								{String((chainAlias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainAlias = resolvedEntity.chainAlias}
					{#if chainAlias !== undefined && chainAlias !== null}
						<div>
							<dt>chain alias</dt>
							<dd>
								{String((chainAlias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
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
										(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							genesisDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const genesisDataHash = prefetched.genesisDataHash}
					{#if genesisDataHash !== undefined && genesisDataHash !== null}
						<div>
							<dt>genesis data hash</dt>
							<dd>
								<TruncatedValue value={String((genesisDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const genesisDataHash = resolvedEntity.genesisDataHash}
					{#if genesisDataHash !== undefined && genesisDataHash !== null}
						<div>
							<dt>genesis data hash</dt>
							<dd>
								<TruncatedValue value={String((genesisDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAtTxId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAtTxId = prefetched.createdAtTxId}
					{#if createdAtTxId !== undefined && createdAtTxId !== null}
						<div>
							<dt>created AT transaction ID</dt>
							<dd>
								<TruncatedValue value={String((createdAtTxId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAtTxId = resolvedEntity.createdAtTxId}
					{#if createdAtTxId !== undefined && createdAtTxId !== null}
						<div>
							<dt>created AT transaction ID</dt>
							<dd>
								<TruncatedValue value={String((createdAtTxId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
