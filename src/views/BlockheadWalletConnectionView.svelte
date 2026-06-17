<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { blockheadWalletConnectionStatusByStatus } from '$/constants/Blockhead.ts'
	import { walletProtocolByProtocol } from '$/constants/Wallet.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		onRemove,
		selector,
		href = resolve(`/~/accounts/connections/connection/${encodeURIComponent(selector.$wallet.id)}`),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			onRemove?: () => void
			selector: EntitySelector<typeof schema, EntityType.BlockheadWalletConnection>
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

	const walletConnection = $derived(proxy(EntityType.BlockheadWalletConnection,
		selector,
		({ sources: [
				Source.Local_Internal,
			], fields: { status: true, protocol: true, transportKind: true, scopes: true, $$connectedAccounts: true, $activeAccount: true, selected: true, connectedAt: true, disconnectedAt: true, sessionId: true, sessionTopic: true, error: true } }),
	))


	// (Derived)
	const walletConnectionKey = $derived(
		stringify(selector),
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
	entitySelector={selector}
	{href}
	title={selector.$wallet.id}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.$wallet.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{selector.$wallet.id}
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
					<div>
						<dt>Status</dt>
						<dd>{blockheadWalletConnectionStatusByStatus[walletConnection.fields.status].label}</dd>
					</div>

					<div>
						<dt>Protocol</dt>
						<dd>{walletProtocolByProtocol[walletConnection.fields.protocol].label}</dd>
					</div>

					<div>
						<dt>Transport</dt>
						<dd>{walletConnection.fields.transportKind}</dd>
					</div>

					{#if walletConnection.fields.$activeAccount}
						<div>
							<dt>Active account</dt>
							<dd>
								<BlockheadWalletAccountView
									selector={walletConnection.fields.$activeAccount.__selector}

								/>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Selected</dt>
							<dd>{walletConnection.fields.selected ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Connected at</dt>
							<dd>
								<Timestamp timestamp={walletConnection.fields.connectedAt} />
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.fields.disconnectedAt != null}
						<div>
							<dt>Disconnected at</dt>
							<dd>
								<Timestamp timestamp={walletConnection.fields.disconnectedAt} />
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.fields.sessionId != null}
						<div>
							<dt>Session ID</dt>
							<dd>
								<TruncatedValue
									value={walletConnection.fields.sessionId}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && walletConnection.fields.sessionTopic != null}
						<div>
							<dt>Session topic</dt>
							<dd>
								<TruncatedValue
									value={walletConnection.fields.sessionTopic}
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
				{#if walletConnection.fields.error}
					<p role="alert">
						{walletConnection.fields.error}
					</p>
				{/if}

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
						{#if walletConnection.fields.$$connectedAccounts.entities.length}
							<ul data-column="gap-1">
								{#each walletConnection.fields.$$connectedAccounts.entities as account (stringify(account.entitySelector))}
									<li>
										<BlockheadWalletAccountView selector={account.entitySelector} />
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
						{#if walletConnection.scopes.length}
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
