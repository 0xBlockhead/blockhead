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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadWalletConnection>>
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
	const blockheadWalletConnection = $derived(selection({
		sources: selection.sources,
		fields: {
			status: true,
			protocol: true,
			transportKind: true,
			selected: true,
		},
	}))
	const titleFallback = $derived('wallet connection')
	const viewDomId = $derived('blockhead-wallet-connection-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletAccountsView from '$/views/BlockheadWalletAccountsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import BlockheadWalletAccountView from '$/views/BlockheadWalletAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.connectionKey !== undefined ? resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
			connectionKey: String(pendingEntity.connectionKey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$wallet}
					>
						{#snippet children(blockheadWallet)}
							{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
							<BlockheadWalletView
								selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
								prefetched={blockheadWallet}
								layout={EntityLayout.Title}
								open={false}
							/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={blockheadWalletConnection}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$wallet}
					>
						{#snippet children(blockheadWallet)}
							{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
							<BlockheadWalletView
								selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
								prefetched={blockheadWallet}
								layout={EntityLayout.Title}
								open={false}
							/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
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
				{#snippet children(blockheadWalletAccount)}
					{#if blockheadWalletAccount != null && blockheadWalletAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Active account</dt>
							<dd>
								<BlockheadWalletAccountView
									selection={select(EntityType.BlockheadWalletAccount, blockheadWalletAccount[EntityMetaKey.Selector])}
									prefetched={blockheadWalletAccount}
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
		{#if detailsOpen}
			<BlockheadWalletAccountsView
				selection={
						selection.$$connectedAccounts({
							count: true,
						})
					}
				title='Connected accounts'
				emptyText='No connected accounts yet.'
				id='BlockheadWalletAccountsView-connected-accounts'
			/>
		{/if}
	{/snippet}
</EntityView>
