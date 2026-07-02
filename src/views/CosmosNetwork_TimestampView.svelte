<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosNetwork_Timestamp>>
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

	const cosmosNetworkTimestamp = $derived(selection({
		fields: {
			latestBlockHeight: true,
			chainId: true,
			isSyncing: true,
			latestBlockHash: true,
			latestBlockTimeMs: true,
			latestBlockTransactionCount: true,
			nodeNetwork: true,
			applicationName: true,
			applicationVersion: true,
			cosmosSdkVersion: true,
			validatorCount: true,
			bondedValidatorCount: true,
			bondedTokens: true,
			notBondedTokens: true,
			governanceProposalCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Cosmos network timestamp')
	const viewDomId = $derived('cosmos-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/observations/[timestampMs=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).latestBlockHeight) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
		{:else}
			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).latestBlockHeight) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos network timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.latestBlockHeight) ?? '')].filter(Boolean).join(' ') || [String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const chainId0 = prefetched.chainId}
			{#if chainId0 !== undefined && chainId0 !== null}
				<span data-text="muted">
					{String((chainId0) ?? '')}
				</span>
			{/if}
			{@const isSyncing1 = prefetched.isSyncing}
			{#if isSyncing1 !== undefined && isSyncing1 !== null}
				<span data-text="muted">
					{String((isSyncing1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const chainId0 = prefetched.chainId}
					{#if chainId0 !== undefined && chainId0 !== null}
						<span data-text="muted">
							{String((chainId0) ?? '')}
						</span>
					{/if}
					{@const isSyncing1 = prefetched.isSyncing}
					{#if isSyncing1 !== undefined && isSyncing1 !== null}
						<span data-text="muted">
							{String((isSyncing1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const chainId0 = entity.chainId}
					{#if chainId0 !== undefined && chainId0 !== null}
						<span data-text="muted">
							{String((chainId0) ?? '')}
						</span>
					{/if}
					{@const isSyncing1 = entity.isSyncing}
					{#if isSyncing1 !== undefined && isSyncing1 !== null}
						<span data-text="muted">
							{String((isSyncing1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={cosmosNetworkTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								{String((timestampMs) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const latestBlockHash = prefetched.latestBlockHash ?? selection.entitySelector.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								{String((latestBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const latestBlockHash = entity.latestBlockHash ?? selection.entitySelector.latestBlockHash ?? prefetched.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								{String((latestBlockHash) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const latestBlockTimeMs = prefetched.latestBlockTimeMs ?? selection.entitySelector.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const latestBlockTimeMs = entity.latestBlockTimeMs ?? selection.entitySelector.latestBlockTimeMs ?? prefetched.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const latestBlockTransactionCount = prefetched.latestBlockTransactionCount ?? selection.entitySelector.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const latestBlockTransactionCount = entity.latestBlockTransactionCount ?? selection.entitySelector.latestBlockTransactionCount ?? prefetched.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const nodeNetwork = prefetched.nodeNetwork ?? selection.entitySelector.nodeNetwork}
					{#if nodeNetwork !== undefined && nodeNetwork !== null}
						<div>
							<dt>Node network</dt>
							<dd>
								{String((nodeNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const nodeNetwork = entity.nodeNetwork ?? selection.entitySelector.nodeNetwork ?? prefetched.nodeNetwork}
					{#if nodeNetwork !== undefined && nodeNetwork !== null}
						<div>
							<dt>Node network</dt>
							<dd>
								{String((nodeNetwork) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const applicationName = prefetched.applicationName ?? selection.entitySelector.applicationName}
					{#if applicationName !== undefined && applicationName !== null}
						<div>
							<dt>Application name</dt>
							<dd>
								{String((applicationName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const applicationName = entity.applicationName ?? selection.entitySelector.applicationName ?? prefetched.applicationName}
					{#if applicationName !== undefined && applicationName !== null}
						<div>
							<dt>Application name</dt>
							<dd>
								{String((applicationName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const applicationVersion = prefetched.applicationVersion ?? selection.entitySelector.applicationVersion}
					{#if applicationVersion !== undefined && applicationVersion !== null}
						<div>
							<dt>Application version</dt>
							<dd>
								{String((applicationVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const applicationVersion = entity.applicationVersion ?? selection.entitySelector.applicationVersion ?? prefetched.applicationVersion}
					{#if applicationVersion !== undefined && applicationVersion !== null}
						<div>
							<dt>Application version</dt>
							<dd>
								{String((applicationVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const cosmosSdkVersion = prefetched.cosmosSdkVersion ?? selection.entitySelector.cosmosSdkVersion}
					{#if cosmosSdkVersion !== undefined && cosmosSdkVersion !== null}
						<div>
							<dt>Cosmos SDK version</dt>
							<dd>
								{String((cosmosSdkVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const cosmosSdkVersion = entity.cosmosSdkVersion ?? selection.entitySelector.cosmosSdkVersion ?? prefetched.cosmosSdkVersion}
					{#if cosmosSdkVersion !== undefined && cosmosSdkVersion !== null}
						<div>
							<dt>Cosmos SDK version</dt>
							<dd>
								{String((cosmosSdkVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const validatorCount = prefetched.validatorCount ?? selection.entitySelector.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>Validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const validatorCount = entity.validatorCount ?? selection.entitySelector.validatorCount ?? prefetched.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>Validator count</dt>
							<dd>
								{String((validatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const bondedValidatorCount = prefetched.bondedValidatorCount ?? selection.entitySelector.bondedValidatorCount}
					{#if bondedValidatorCount !== undefined && bondedValidatorCount !== null}
						<div>
							<dt>Bonded validators</dt>
							<dd>
								{String((bondedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const bondedValidatorCount = entity.bondedValidatorCount ?? selection.entitySelector.bondedValidatorCount ?? prefetched.bondedValidatorCount}
					{#if bondedValidatorCount !== undefined && bondedValidatorCount !== null}
						<div>
							<dt>Bonded validators</dt>
							<dd>
								{String((bondedValidatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const bondedTokens = prefetched.bondedTokens ?? selection.entitySelector.bondedTokens}
					{#if bondedTokens !== undefined && bondedTokens !== null}
						<div>
							<dt>Bonded tokens</dt>
							<dd>
								{String((bondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const bondedTokens = entity.bondedTokens ?? selection.entitySelector.bondedTokens ?? prefetched.bondedTokens}
					{#if bondedTokens !== undefined && bondedTokens !== null}
						<div>
							<dt>Bonded tokens</dt>
							<dd>
								{String((bondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const notBondedTokens = prefetched.notBondedTokens ?? selection.entitySelector.notBondedTokens}
					{#if notBondedTokens !== undefined && notBondedTokens !== null}
						<div>
							<dt>Not bonded tokens</dt>
							<dd>
								{String((notBondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const notBondedTokens = entity.notBondedTokens ?? selection.entitySelector.notBondedTokens ?? prefetched.notBondedTokens}
					{#if notBondedTokens !== undefined && notBondedTokens !== null}
						<div>
							<dt>Not bonded tokens</dt>
							<dd>
								{String((notBondedTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={cosmosNetworkTimestamp}>
				{#snippet Pending()}
					{@const governanceProposalCount = prefetched.governanceProposalCount ?? selection.entitySelector.governanceProposalCount}
					{#if governanceProposalCount !== undefined && governanceProposalCount !== null}
						<div>
							<dt>Governance proposals</dt>
							<dd>
								{String((governanceProposalCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const governanceProposalCount = entity.governanceProposalCount ?? selection.entitySelector.governanceProposalCount ?? prefetched.governanceProposalCount}
					{#if governanceProposalCount !== undefined && governanceProposalCount !== null}
						<div>
							<dt>Governance proposals</dt>
							<dd>
								{String((governanceProposalCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
