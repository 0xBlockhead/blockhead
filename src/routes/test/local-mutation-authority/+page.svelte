<script lang="ts">
	// Types/constants
	import {
		WalletCapability,
		WalletDiscoveryKind,
		WalletProtocol,
		WalletTransportKind,
	} from '$/constants/Wallet.ts'
	import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import {
		deleteLocalBlockheadSession,
		deleteLocalBlockheadWalletConnection,
		writeLocalBlockheadSession,
		writeLocalBlockheadSessionName,
		writeLocalBlockheadSessionSimulation,
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
	const resourceBoundarySessionParentSelector = {
		scope: 'resource-boundary-nested-sessions',
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
	const walletConnectionHydration = select(
		EntityType.BlockheadWalletConnection,
		{
			connectionKey: 'authority-connection-a',
		},
		{
			sources: [Source.Local_Internal],
		}
	)
	const resourceBoundarySessions = select(
		EntityType._Global,
		resourceBoundarySessionParentSelector,
		{
			sources: [Source.Local_Internal],
		}
	).$$blockheadSessions
	const resourceBoundarySessionRows = resourceBoundarySessions({
		sources: [Source.Local_Internal],
		fields: {
			name: true,
		},
	})
	const firstResourceBoundarySession = resourceBoundarySessions.first({
		sources: [Source.Local_Internal],
		fields: {
			name: true,
		},
	})
	let sessionsPersisted = $state(false)
	let walletsPersisted = $state(false)
	let walletHydrationEnabled = $state(false)
	let walletHydrationSettled = $state(false)
	let walletHydrationSummary = $state('')
	let resourceBoundarySessionSelector = $state<{
		id: string,
	}>()
	let entityReferenceSessionSelector = $state<{
		id: string,
	}>()
	void walletConnectionRows.then(async (connections) => {
		walletHydrationEnabled = connections.values.some((connection) => (
			connection.connectionKey === 'authority-connection-a'
		))
		if (!walletHydrationEnabled) return
		const walletResource = walletConnectionHydration.$wallet
		const accountsResource = walletConnectionHydration.$$accounts({
				sources: [Source.Local_Internal],
			})
		const activeAccountResource = walletConnectionHydration.$activeAccount
		const [wallet, accounts, activeAccount] = await Promise.all([
			walletResource,
			accountsResource,
			activeAccountResource,
		])
		walletHydrationSummary = `${wallet[EntityMetaKey.Selector].id}|${accounts.values.length}|${activeAccount?.[EntityMetaKey.Selector].caip10.accountAddress ?? 'none'}`
		walletHydrationSettled = true
	})


	// Functions
	const createSessions = async () => {
		sessionsPersisted = false
		const client = getAppClient()
		await writeLocalBlockheadSession(client, sessionParentSelector, 'Authority Session A')
		await writeLocalBlockheadSession(client, sessionParentSelector, 'Authority Session B')
		sessionsPersisted = true
	}

	const deleteFirstSession = async () => {
		sessionsPersisted = false
		const session = sessionRows.current?.values.find((row) => row.name === 'Authority Session A')
		if (session != null)
			await deleteLocalBlockheadSession(
				getAppClient(),
				sessionParentSelector,
				session[EntityMetaKey.Selector]
			)
		sessionsPersisted = true
	}

	const clearSessions = async () => {
		sessionsPersisted = false
		for (const session of sessionRows.current?.values ?? [])
			await deleteLocalBlockheadSession(
				getAppClient(),
				sessionParentSelector,
				session[EntityMetaKey.Selector]
			)
		sessionsPersisted = true
	}

	const createWalletConnections = async () => {
		walletsPersisted = false
		walletHydrationEnabled = false
		for (const suffix of ['a', 'b']) {
			await writeLocalBlockheadWallet(getAppClient(), {
				id: `authority-wallet-${suffix}`,
				name: `Authority Wallet ${suffix.toUpperCase()}`,
				icon: '',
				protocol: WalletProtocol.Eip6963,
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
				transportKind: WalletTransportKind.InjectedProvider,
				capabilities: [WalletCapability.Connect],
			})
			await writeLocalBlockheadWalletConnection(getAppClient(), {
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
		walletsPersisted = true
		walletHydrationEnabled = true
	}

	const clearWalletConnections = async () => {
		walletsPersisted = false
		walletHydrationEnabled = false
		for (const connection of walletConnectionRows.current?.values ?? [])
			await deleteLocalBlockheadWalletConnection(
				getAppClient(),
				connection.connectionKey
			)
		walletsPersisted = true
	}

	const deleteFirstWalletConnection = async () => {
		walletsPersisted = false
		await deleteLocalBlockheadWalletConnection(
			getAppClient(),
			'authority-connection-a'
		)
		walletsPersisted = true
	}

	const disconnectFirstWalletConnection = async () => {
		walletsPersisted = false
		await writeLocalBlockheadWalletConnection(getAppClient(), {
			connectionKey: 'authority-connection-a',
			walletId: 'authority-wallet-a',
			status: BlockheadConnectionStatus.Disconnected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [],
			selected: false,
			disconnectedAt: 2,
		})
		walletHydrationEnabled = false
		walletsPersisted = true
	}

	const materializeResourceBoundarySession = async () => {
		resourceBoundarySessionSelector = await writeLocalBlockheadSession(
			getAppClient(),
			resourceBoundarySessionParentSelector,
			'Resource Boundary 100'
		)
	}

	const updateResourceBoundarySession = () => {
		if (resourceBoundarySessionSelector === undefined)
			return

		writeLocalBlockheadSessionName(
			getAppClient(),
			resourceBoundarySessionSelector,
			'Resource Boundary 101'
		)
	}

	const materializeEntityReferenceSession = async () => {
		entityReferenceSessionSelector = await writeLocalBlockheadSession(
			getAppClient(),
			resourceBoundarySessionParentSelector,
			'Entity reference session'
		)
		await writeLocalBlockheadSessionSimulation(
			getAppClient(),
			entityReferenceSessionSelector,
			{
				id: 'entity-reference-simulation-a',
				status: 'succeeded',
				createdAt: 100,
				paramsHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			}
		)
	}

	const replaceEntityReferenceSimulation = async () => {
		if (entityReferenceSessionSelector === undefined)
			return

		await writeLocalBlockheadSessionSimulation(
			getAppClient(),
			entityReferenceSessionSelector,
			{
				id: 'entity-reference-simulation-b',
				status: 'failed',
				createdAt: 101,
				paramsHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				error: 'fixture failure',
			}
		)
	}


	// Components
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
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
		<button type="button" onclick={clearSessions}>Clear sessions</button>
		<button type="button" onclick={createSessions}>Create sessions</button>
		<button type="button" onclick={deleteFirstSession}>Delete first session</button>
	</div>

	<p data-testid="session-direct">
		{sessionRows.current?.values.map((session) => session.name).join('|') ?? ''}
	</p>

	<p data-testid="sessions-persisted">
		{sessionsPersisted ? 'persisted' : 'pending'}
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
	<h2>Nested resource boundaries</h2>

	<div data-row="wrap gap-2">
		<button type="button" onclick={materializeResourceBoundarySession}>Materialize boundary session</button>
		<button type="button" onclick={updateResourceBoundarySession}>Update boundary session</button>
	</div>

	<ResourceBoundary resource={resourceBoundarySessionRows}>
		{#snippet children(resolvedSessions)}
			<p data-testid="nested-resource-collection-awaited">
				{resolvedSessions.values.map((session) => session.name).join('|')}
			</p>
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary resource={firstResourceBoundarySession}>
		{#snippet children(resolvedSession)}
			<p data-testid="nested-resource-first-awaited">
				{resolvedSession?.name ?? ''}
			</p>
		{/snippet}
	</ResourceBoundary>

	<div data-row="wrap gap-2">
		<button type="button" onclick={materializeEntityReferenceSession}>Materialize entity reference</button>
		<button type="button" onclick={replaceEntityReferenceSimulation}>Replace entity reference</button>
	</div>

	{#if entityReferenceSessionSelector !== undefined}
		<div data-testid="entity-reference-session-view">
			<BlockheadSessionView
				selection={select(
					EntityType.BlockheadSession,
					entityReferenceSessionSelector,
					{
						sources: [Source.Local_Internal],
					}
				)}
			/>
		</div>
	{/if}
</section>

<section data-column="gap-3">
	<h2>Wallet connections</h2>

	<div data-row="wrap gap-2">
		<button type="button" onclick={clearWalletConnections}>Clear wallet connections</button>
		<button type="button" onclick={createWalletConnections}>Create wallet connections</button>
		<button type="button" onclick={disconnectFirstWalletConnection}>Disconnect first wallet connection</button>
		<button
			type="button"
			onclick={deleteFirstWalletConnection}
		>
			Delete first wallet connection
		</button>
	</div>

	<p data-testid="wallet-direct">
		{walletConnectionRows.current?.values.map((connection) => connection.connectionKey).join('|') ?? ''}
	</p>

	<p data-testid="wallets-persisted">{walletsPersisted ? 'persisted' : 'pending'}</p>
	<p data-testid="wallet-hydration-settled">{walletHydrationSettled ? 'settled' : 'pending'}</p>
	<p data-testid="wallet-hydration-summary">{walletHydrationSummary}</p>

	<ResourceBoundary resource={walletConnectionRows}>
		{#snippet children(resolvedWalletConnections)}
			<p data-testid="wallet-awaited">
				{resolvedWalletConnections.values.map((connection) => connection.connectionKey).join('|')}
			</p>
		{/snippet}
	</ResourceBoundary>

	<BlockheadWalletConnectionsView
		selection={walletConnections}
		collapsible={false}
		emptyText="No runtime wallet connections."
		id="local-authority-wallet-connections"
	/>
</section>
