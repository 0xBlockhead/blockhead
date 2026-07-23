<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadWalletConnection>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadWalletConnection>
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
	const blockheadWalletConnection = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
			protocol: true,
			transportKind: true,
			selected: true,
		},
	}))
	const titleFallback = 'wallet connection'
	const viewDomId = $derived('blockhead-wallet-connection-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AccountsView from '$/views/AccountsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import AccountView from '$/views/AccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'connectionKey' in selection.entitySelector
			&& selection.entitySelector.connectionKey != null ?
				resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
			connectionKey: String(selection.entitySelector.connectionKey ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$wallet') && prefetched.$wallet != null && prefetched.$wallet[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$wallet, 'name') && Object.hasOwn(prefetched.$wallet, 'protocol') && Object.hasOwn(prefetched, 'status')}
			{@const blockheadWallet0 = pendingEntity.$wallet}
			{#if blockheadWallet0 != null && blockheadWallet0[EntityMetaKey.Selector] != null}
				<BlockheadWalletView
					selection={select(EntityType.BlockheadWallet, blockheadWallet0[EntityMetaKey.Selector], { sources: selection.sources })}
					prefetched={blockheadWallet0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection.$wallet}
					>
						{#snippet children(blockheadWallet)}
							{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
							<BlockheadWalletView
								selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
								prefetched={blockheadWallet}
								href=""
								layout={EntityLayout.Title}
								open={false}
							/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$wallet') && prefetched.$wallet != null && prefetched.$wallet[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$wallet, 'name') && Object.hasOwn(prefetched.$wallet, 'protocol') && Object.hasOwn(prefetched, 'status')}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$wallet') && prefetched.$wallet != null && prefetched.$wallet[EntityMetaKey.Selector] != null && Object.hasOwn(prefetched.$wallet, 'name') && Object.hasOwn(prefetched.$wallet, 'protocol') && Object.hasOwn(prefetched, 'status')}
			{@const status0 = pendingEntity.status}
			{#if status0 !== undefined && status0 !== null}
				<span data-text="muted">
					{String((status0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status0 = resolvedEntity.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									connectionKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionKey = resolvedEntity.connectionKey}
							{#if connectionKey !== undefined && connectionKey !== null}
								{String((connectionKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Wallet</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$wallet}
					>
						{#snippet children(blockheadWallet)}
							{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocol = resolvedEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transport</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transportKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportKind = resolvedEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Selected</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									selected: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const selected = resolvedEntity.selected}
							{#if selected !== undefined && selected !== null}
								{selected ? 'Yes' : 'No'}
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
						sources: selection.sources,
						fields: {
							connectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const connectedAt = resolvedEntity.connectedAt}
					{#if connectedAt !== undefined && connectedAt !== null}
						<div>
							<dt>Connected</dt>
							<dd>
								<Timestamp timestamp={Number(connectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							disconnectedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const disconnectedAt = resolvedEntity.disconnectedAt}
					{#if disconnectedAt !== undefined && disconnectedAt !== null}
						<div>
							<dt>Disconnected</dt>
							<dd>
								<Timestamp timestamp={Number(disconnectedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sessionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sessionId = resolvedEntity.sessionId}
					{#if sessionId !== undefined && sessionId !== null}
						<div>
							<dt>Session ID</dt>
							<dd>
								{String((sessionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sessionTopic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sessionTopic = resolvedEntity.sessionTopic}
					{#if sessionTopic !== undefined && sessionTopic !== null}
						<div>
							<dt>Session topic</dt>
							<dd>
								{String((sessionTopic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$activeAccount}
			>
				{#snippet children(account)}
					{#if account != null && account[EntityMetaKey.Selector] != null}
						<div>
							<dt>Active account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									prefetched={account}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadWalletConnectionAccountsViewAccountsResource = selection.$$accounts}
		<ResourceBoundary
			resource={blockheadWalletConnectionAccountsViewAccountsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AccountsView
					selection={blockheadWalletConnectionAccountsViewAccountsResource}
					countResource={blockheadWalletConnectionAccountsViewAccountsResource.count}
					title='Accounts'
					id='AccountsView-accounts'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
