<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import {
		EntityProxyField,
		type EntityProxyResource,
	} from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadWalletConnectionStatusByStatus } from '$/constants/Blockhead.ts'
	import { walletProtocolByProtocol } from '$/constants/Wallet.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		onRemove,
		selection,
		href = resolve(`/~/accounts/connections/connection/${encodeURIComponent(selection.entitySelector.$wallet.id)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			onRemove?: () => void
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletConnection>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()


	const walletConnection = $derived(selection(
		({ sources: [
				Source.Local_Internal,
			], fields: { status: true, protocol: true, transportKind: true, scopes: true, $$connectedAccounts: true, $activeAccount: true, selected: true, connectedAt: true, disconnectedAt: true, sessionId: true, sessionTopic: true, error: true } }),
	))
	const walletConnectionError = $derived(walletConnection[EntityProxyField]('error'))


	// (Derived)
	const walletConnectionKey = $derived(
		stringify(selection.entitySelector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BlockheadWalletAccountView from '$/views/BlockheadWalletAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	bind:open
	entitySelector={selection.entitySelector}
	{href}
	title={selection.entitySelector.$wallet.id}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.$wallet.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{selection.entitySelector.$wallet.id}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Wallet sessions are persisted as protocol-neutral authorization scopes and CAIP-10 accounts.
		</p>
		<p>
			Live provider handles stay in the browser runtime and are never stored in OPFS.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={walletConnection}
			placeholderText="Loading wallet connection…"
		>
			{#snippet children(walletConnection)}
				<dl data-column-item="center">
					{#if walletConnection.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{blockheadWalletConnectionStatusByStatus[walletConnection.status].label}</dd>
						</div>
					{/if}

					{#if walletConnection.protocol !== undefined}
						<div>
							<dt>Protocol</dt>
							<dd>{walletProtocolByProtocol[walletConnection.protocol].label}</dd>
						</div>
					{/if}

					<div>
						<dt>Transport</dt>
						<dd>{walletConnection.transportKind}</dd>
					</div>

					{#if walletConnection.$activeAccount}
						<div>
							<dt>Active account</dt>
							<dd>
								<BlockheadWalletAccountView
									selection={select(EntityType.BlockheadWalletAccount, walletConnection.$activeAccount.__selector)}

								/>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Selected</dt>
							<dd>{walletConnection.selected ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Connected at</dt>
							<dd>
								<Timestamp timestamp={walletConnection.connectedAt} />
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.disconnectedAt != null}
						<div>
							<dt>Disconnected at</dt>
							<dd>
								<Timestamp timestamp={walletConnection.disconnectedAt} />
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.sessionId != null}
						<div>
							<dt>Session ID</dt>
							<dd>
								<TruncatedValue
									value={walletConnection.sessionId}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.sessionTopic != null}
						<div>
							<dt>Session topic</dt>
							<dd>
								<TruncatedValue
									value={walletConnection.sessionTopic}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<ResourceBoundary
			resource={walletConnection}
			placeholderText="Loading wallet connection…"
		>
			{#snippet children(walletConnection)}
				<ResourceBoundary
					resource={walletConnectionError}
					placeholderText="Loading wallet connection error…"
				>
					{#snippet children(error)}
						{#if error !== undefined && error !== ''}
							<p role="alert">
								{error}
							</p>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<CollapsibleTabs
					id={`${walletConnectionKey}:carousel-wallet`}
					sectionIdPrefix={walletConnectionKey}
					sections={[
						{ id: 'wallet-accounts', label: 'Accounts' },
						{ id: 'wallet-scopes', label: 'Scopes' },
						{ id: 'wallet-actions', label: 'Actions' },
					]}
					data-card
				>
					{#snippet Summary()}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								Wallet connection
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionWalletAccounts()}
						{#if walletConnection.$$connectedAccounts?.entities.length}
							<ul data-column="gap-1">
								{#each walletConnection.$$connectedAccounts.entities as account (stringify(account.entitySelector))}
									<li>
										<BlockheadWalletAccountView selection={select(EntityType.BlockheadWalletAccount, account.entitySelector)} />
									</li>
								{/each}
							</ul>
						{:else}
							<p data-text="muted">
								No accounts are connected to this wallet yet.
							</p>
						{/if}
					{/snippet}

					{#snippet SectionWalletScopes()}
						{#if walletConnection.scopes !== undefined && walletConnection.scopes.length > 0}
							<ul data-column="gap-1">
								{#each walletConnection.scopes as scope (`${scope.namespace}:${scope.reference}`)}
									<li>
										<code>{scope.namespace}:{scope.reference}</code>
									</li>
								{/each}
							</ul>
						{:else}
							<p data-text="muted">
								No signing scopes are connected yet.
							</p>
						{/if}
					{/snippet}

					{#snippet SectionWalletActions()}
						{#if onRemove}
							<div data-row>
								<button
									type="button"
									onclick={onRemove}
								>
									Remove
								</button>
							</div>
						{:else}
							<p data-text="muted">
								No runtime action is available for this persisted connection.
							</p>
						{/if}
					{/snippet}
				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
