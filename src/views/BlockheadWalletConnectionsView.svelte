<script lang="ts">
	// Types/constants
	import type { Eip6963ProviderDetail } from '$/lib/eip6963.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	type WalletConnection = {
		detail: Eip6963ProviderDetail
		accounts: `0x${string}`[]
		chainId: number | null
		status: 'connecting' | 'connected' | 'error'
		error: string | null
	}


	// Props
	let {
		id,
		href,
		title = 'Wallet connections',
		open = $bindable(true),
	}: {
		id: string
		href: string
		title?: string
		open?: boolean
	} = $props()


	// State
	import {
		subscribeEip6963Providers,
	} from '$/lib/eip6963.ts'
	import {
		getChainId,
		onAccountsChanged,
		onChainChanged,
		requestAccounts,
	} from '$/lib/eip1193.ts'
	import { SvelteMap } from 'svelte/reactivity'


	const cleanupByRdns = new SvelteMap<string, () => void>()

	let providers = $state<Eip6963ProviderDetail[]>([])

	let connections = $state<WalletConnection[]>([])

	let eip6963Hydrated = $state(false)


	// Actions
	const updateConnection = (
		rdns: string,
		getNextConnection: (connection: WalletConnection | null) => WalletConnection,
	) => {
		const currentConnection = connections.find((connection) => connection.detail.info.rdns === rdns) ?? null
		const nextConnection = getNextConnection(currentConnection)

		connections = [
			...connections.filter((connection) => connection.detail.info.rdns !== rdns),
			nextConnection,
		]
	}

	const disconnect = (rdns: string) => {
		cleanupByRdns.get(rdns)?.()
		cleanupByRdns.delete(rdns)
		connections = connections.filter((connection) => connection.detail.info.rdns !== rdns)
	}

	const subscribeConnection = (detail: Eip6963ProviderDetail) => {
		if (cleanupByRdns.has(detail.info.rdns)) return

		cleanupByRdns.set(detail.info.rdns, () => {})

		const unsubscribeAccountsChanged = onAccountsChanged(detail.provider, (accounts) => {
			if (!accounts.length) {
				disconnect(detail.info.rdns)
				return
			}

			updateConnection(detail.info.rdns, (connection) => ({
				detail,
				accounts,
				chainId: connection?.chainId ?? null,
				status: 'connected',
				error: null,
			}))
		})

		const unsubscribeChainChanged = onChainChanged(detail.provider, (chainId) => {
			updateConnection(detail.info.rdns, (connection) => ({
				detail,
				accounts: connection?.accounts ?? [],
				chainId,
				status: connection?.status ?? 'connected',
				error: connection?.error ?? null,
			}))
		})

		cleanupByRdns.set(detail.info.rdns, () => {
			unsubscribeAccountsChanged()
			unsubscribeChainChanged()
		})
	}


	const connect = async (detail: Eip6963ProviderDetail) => {
		updateConnection(detail.info.rdns, (connection) => ({
			detail,
			accounts: connection?.accounts ?? [],
			chainId: connection?.chainId ?? null,
			status: 'connecting',
			error: null,
		}))

		try {
			const accounts = await requestAccounts(detail.provider)

			if (!accounts.length)
				throw new Error('Provider did not return any accounts')

			const chainId = await getChainId(detail.provider)

			updateConnection(detail.info.rdns, () => ({
				detail,
				accounts,
				chainId,
				status: 'connected',
				error: null,
			}))

			subscribeConnection(detail)
		}
		catch (error) {
			updateConnection(detail.info.rdns, (connection) => ({
				detail,
				accounts: connection?.accounts ?? [],
				chainId: connection?.chainId ?? null,
				status: 'error',
				error:
					error instanceof Error ?
						error.message
					:
						String(error),
			}))
		}
	}


	// (Derived)
	$effect(() => (
		subscribeEip6963Providers((nextProviders) => {
			providers = nextProviders
			eip6963Hydrated = true
		})
	))

	$effect(() => (
		() => {
			for (const cleanup of cleanupByRdns.values())
				cleanup()

			cleanupByRdns.clear()
		}
	))


	// Components
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Icon from '$/components/Icon.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadWalletConnection}
	{id}
	{href}
	{title}
	bind:open
>
	{#snippet body()}
		{#if !eip6963Hydrated}
			<div
				data-card
				data-text="muted"
				class="loading"
			>
				<p>
					Loading wallets…
				</p>
			</div>
		{:else}
			{@const sortedConnections = (
				[...connections]
					.sort((connectionA, connectionB) => (
						connectionA.detail.info.name.localeCompare(connectionB.detail.info.name)
					))
			)}
			{@const availableProviders = providers.filter((provider) => (
				!connections.some((connection) => connection.detail.info.rdns === provider.info.rdns)
			))}
			<div data-column="gap-3">
				{#if sortedConnections.length}
					<div data-column="gap-2">
						{#each sortedConnections as connection (connection.detail.info.rdns)}
							<BlockheadWalletConnectionView
								entityId={{
									$wallet: {
										rdns: connection.detail.info.rdns,
									},
								}}
								title={connection.detail.info.name}
								icon={connection.detail.info.icon}
								accounts={connection.accounts}
								chainId={connection.chainId}
								status={connection.status}
								error={connection.error}
								onRemove={() => disconnect(connection.detail.info.rdns)}
								{href}
								open={false}
							/>
						{/each}
					</div>
				{:else}
					<p data-text="muted">
						No wallet connections yet.
					</p>
				{/if}

				{#if availableProviders.length}
					<div data-row="start">
						{#each availableProviders as detail (detail.info.rdns)}
							<button
								type="button"
								data-row="align-center"
								onclick={() => connect(detail)}
							>
								{#if detail.info.icon}
									<Icon
										src={detail.info.icon}
										alt={detail.info.name}
									/>
								{/if}

								<span>
									Connect {detail.info.name}
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</EntitiesList>


<style>
	.loading {
		cursor: wait;
	}
</style>
