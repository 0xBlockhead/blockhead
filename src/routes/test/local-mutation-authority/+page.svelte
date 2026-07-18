<script lang="ts">
	// Types/constants
	import {
		WalletCapability,
		WalletDiscoveryKind,
		WalletProtocol,
		WalletTransportKind,
	} from '$/constants/Wallet.ts'
	import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import {
		deleteLocalBlockheadSession,
		deleteLocalBlockheadWalletConnection,
		writeLocalBlockheadSession,
		writeLocalBlockheadWallet,
		writeLocalBlockheadWalletConnection,
	} from '$/collections/localMutations.ts'
	import {
		getAppClient,
		select,
	} from '$/routes/+layout.svelte'


	// State
	const sessionParentSelector = {
		scope: '$$blockheadSessions',
	} as const
	const walletConnectionParentSelector = {
		scope: '$$blockheadWalletConnections',
	} as const
	const sessions = select(
		EntityType._Global,
		sessionParentSelector,
		{
			sources: [Source.Local_Internal],
		}
	).$$blockheadSessions
	const sessionRows = sessions({
		sources: [Source.Local_Internal],
		fields: {
			name: true,
		},
	})
	const walletConnections = select(
		EntityType._Global,
		walletConnectionParentSelector,
		{
			sources: [Source.Local_Internal],
		}
	).$$blockheadWalletConnections
	const walletConnectionRows = walletConnections({
		sources: [Source.Local_Internal],
		fields: {
			connectionKey: true,
		},
	})
	const wallets = select(
		EntityType._Global,
		{
			scope: '$$blockheadWallets',
		},
		{
			sources: [Source.Local_Internal],
		}
	).$$blockheadWallets
	const walletRows = wallets({
		sources: [Source.Local_Internal],
		fields: {
			id: true,
		},
	})
	const walletAccounts = select(
		EntityType._Global,
		{
			scope: '$$blockheadWalletAccounts',
		},
		{
			sources: [Source.Local_Internal],
		}
	).$$blockheadWalletAccounts
	const walletAccountRows = walletAccounts({
		sources: [Source.Local_Internal],
		fields: {
			caip10: true,
		},
	})
	const walletConnectionHydration = select(
		EntityType.BlockheadWalletConnection,
		{
			connectionKey: 'authority-connection-a',
		},
		{
			sources: [Source.Local_Internal],
		}
	)
	const walletHydrationVisible = $derived(
		walletConnectionRows.current?.values.some((connection) => connection.connectionKey === 'authority-connection-a') === true
		&& walletRows.current?.values.some((wallet) => wallet.id === 'authority-wallet-a') === true
		&& walletAccountRows.current?.values.some((account) => account.caip10.accountAddress === '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa') === true
	)


	// Functions
	const createSessions = () => {
		writeLocalBlockheadSession(getAppClient(), sessionParentSelector, 'Authority Session A')
		writeLocalBlockheadSession(getAppClient(), sessionParentSelector, 'Authority Session B')
	}

	const deleteFirstSession = () => {
		const session = sessionRows.current?.values.find((row) => row.name === 'Authority Session A')
		if (session != null)
			deleteLocalBlockheadSession(
				getAppClient(),
				sessionParentSelector,
				session[EntityMetaKey.Selector]
			)
	}

	const createWalletConnections = () => {
		for (const suffix of ['a', 'b']) {
			writeLocalBlockheadWallet(getAppClient(), {
				id: `authority-wallet-${suffix}`,
				name: `Authority Wallet ${suffix.toUpperCase()}`,
				icon: '',
				protocol: WalletProtocol.Eip6963,
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
				transportKind: WalletTransportKind.InjectedProvider,
				capabilities: [WalletCapability.Connect],
			})
			writeLocalBlockheadWalletConnection(getAppClient(), {
				connectionKey: `authority-connection-${suffix}`,
				walletId: `authority-wallet-${suffix}`,
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [{
					namespace: 'eip155',
					reference: '1',
					accountAddress: `0x${suffix.repeat(40)}`,
					capabilities: [WalletCapability.Connect],
				}],
				selected: suffix === 'a',
				connectedAt: 1,
			})
		}
	}


	// Components
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<svelte:head>
	<title>Local mutation authority • Blockhead</title>
</svelte:head>

<h1>Local mutation authority</h1>

<section data-column="gap-3">
	<h2>Sessions</h2>

	<div data-row="wrap gap-2">
		<button type="button" onclick={createSessions}>Create sessions</button>
		<button type="button" onclick={deleteFirstSession}>Delete first session</button>
	</div>

	<p data-testid="session-direct">
		{sessionRows.current?.values.map((session) => session.name).join('|') ?? ''}
	</p>

	<ResourceBoundary resource={sessionRows}>
		{#snippet children(resolvedSessions)}
			<p data-testid="session-awaited">
				{resolvedSessions.values.map((session) => session.name).join('|')}
			</p>
		{/snippet}
	</ResourceBoundary>

	<BlockheadSessionsView
		selection={sessions}
		collapsible={false}
		emptyText="No runtime sessions."
		id="local-authority-sessions"
	/>
</section>

<section data-column="gap-3">
	<h2>Wallet connections</h2>

	<div data-row="wrap gap-2">
		<button type="button" onclick={createWalletConnections}>Create wallet connections</button>
		<button
			type="button"
			onclick={() => deleteLocalBlockheadWalletConnection(
				getAppClient(),
				'authority-connection-a'
			)}
		>
			Delete first wallet connection
		</button>
	</div>

	<p data-testid="wallet-direct">
		{walletConnectionRows.current?.values.map((connection) => connection.connectionKey).join('|') ?? ''}
	</p>

	<ResourceBoundary resource={walletConnectionRows}>
		{#snippet children(resolvedWalletConnections)}
			<p data-testid="wallet-awaited">
				{resolvedWalletConnections.values.map((connection) => connection.connectionKey).join('|')}
			</p>
		{/snippet}
	</ResourceBoundary>

	{#if walletHydrationVisible}
		<ResourceBoundary resource={walletConnectionHydration.$wallet}>
		{#snippet children(wallet)}
			<p data-testid="wallet-hydration-wallet">
				{wallet[EntityMetaKey.Selector].id}
			</p>
		{/snippet}
		</ResourceBoundary>

	<ResourceBoundary resource={walletConnectionHydration.$activeAccount}>
		{#snippet children(activeAccount)}
			<p data-testid="wallet-hydration-active-account">
				{activeAccount[EntityMetaKey.Selector].caip10.accountAddress}
			</p>
		{/snippet}
		</ResourceBoundary>

	<ResourceBoundary
		resource={walletConnectionHydration.$$connectedAccounts({
			sources: [Source.Local_Internal],
			count: true,
		})}
	>
		{#snippet children(accounts)}
			<p data-testid="wallet-hydration-account-count">
				{accounts.values.length}
			</p>
		{/snippet}
		</ResourceBoundary>
	{/if}

	<BlockheadWalletConnectionsView
		selection={walletConnections}
		collapsible={false}
		emptyText="No runtime wallet connections."
		id="local-authority-wallet-connections"
	/>
</section>
