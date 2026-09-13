<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import {
		WalletCapability,
		WalletProtocol,
	} from '$/constants/Wallet.ts'
	import { normalizeBoundaryError } from '$/lib/errors.ts'
	import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	import { getWalletConnectionRuntime } from '$/state/wallets/walletConnectionRuntime.svelte.ts'
	import { walletConnectionError } from '$/state/wallets/walletConnectionState.ts'
	const select = getAppClient().select


	// IDs
	const id = 'wallet-connections'


	// State
	const walletRuntime = $derived(getWalletConnectionRuntime())
	const availableCandidates = $derived(walletRuntime?.candidates.filter((candidate) => (
		candidate.protocol === WalletProtocol.WalletConnectV2
		|| !walletRuntime.connections.some((connection) => connection.walletId === candidate.id)
	)) ?? [])
	const walletRequests = $derived(
		select(EntityType._Global, {
			scope: '$$blockheadWalletRequests',
		})
			.$$blockheadWalletRequests({
				sources: [
					Source.Local_Internal,
				],
			})
	)
	let walletRequestPending = $state(
		false
	)
	let walletRequestFailure = $state<{
		error: Error
	}>()
	let walletControlStatus = $state(
		''
	)
	let walletControlFailure = $state<{
		error: Error
	}>()
	let walletAccountSelectionPending = $state(false)
	let walletConnectionMutationPending = $state<string>()
	let ledgerLoading = $state(false)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Boundary from '$/components/Boundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadWalletRequestsView from '$/views/BlockheadWalletRequestsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import Icon from '$/components/Icon.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import WalletTransactionForm from './WalletTransactionForm.svelte'
</script>


<article
	{id}
	data-column-item="flexible"
	data-card
	data-scroll-container
>
	<header>
		<h2>Wallet connection status</h2>
	</header>

	<output aria-live="polite">
		{walletRuntime == null ?
			'Wallet discovery inactive.'
		:
			`Wallet discovery active. Active connections: ${walletRuntime.connections.filter((connection) => connection.status === BlockheadConnectionStatus.Connected).length}. Saved connections: ${walletRuntime.connections.length}. Providers detected: ${walletRuntime.candidates.length}.`}
	</output>

	<output aria-live="polite">{walletControlStatus}</output>
	{#if walletRuntime && !walletRuntime.candidates.some((candidate) => candidate.id === 'ledger:speculos')}
		<button
			type="button"
			disabled={ledgerLoading}
			onclick={async () => {
				if (walletRuntime == null || ledgerLoading)
					return
				ledgerLoading = true
				walletControlFailure = undefined
				try {
					const { createLedgerSpeculosAdapter } = await import('$/state/wallets/adapters/ledgerSpeculos.ts')
					walletRuntime.registerAdapter(createLedgerSpeculosAdapter())
					walletControlStatus = 'Ledger emulator enabled. Connect below; device review opens in Speculos. This is not physical hardware.'
				} catch (error) {
					walletControlFailure = { error: normalizeBoundaryError(error) }
				} finally {
					ledgerLoading = false
				}
			}}
		>
			Enable local Ledger emulator
		</button>
	{/if}

	<Boundary
		failure={walletControlFailure}
		boundaryKey="Wallet application open"
	/>
</article>

{#if walletRuntime}
	{#if walletRuntime.connections.length > 0}
		{#each walletRuntime.connections.toSorted((connectionA, connectionB) => (
			(connectionA.connectionKey ?? connectionA.walletId).localeCompare(connectionB.connectionKey ?? connectionB.walletId)
		)) as connection (connection.connectionKey ?? connection.walletId)}
			{@const connectionKey = connection.connectionKey ?? connection.walletId}
			{@const candidate = walletRuntime.candidates.find((candidate) => candidate.id === connection.walletId)}
			{@const connectionFailure = walletConnectionError(connection)}
			<article
				data-column-item="flexible"
				data-card
				data-scroll-container
				data-connection-status={connection.status}
				data-wallet-id={connection.walletId}
				data-wallet-name={candidate?.name ?? connection.walletId}
				data-wallet-state="connection"
			>
				<EntityView
					entityType={EntityType.BlockheadWalletConnection}
					entitySelector={{
						connectionKey,
					}}
					href={resolve(
						'/~/wallets/connections/[connectionKey=stringSegment]',
						{
							connectionKey,
						}
					)}
					layout={EntityLayout.SummaryInline}
					open={false}
				>
					{#snippet Title()}
						{candidate?.name ?? connection.walletId}
					{/snippet}

					{#snippet HeadingAfter()}
						<span data-text="muted">{connection.status}</span>
					{/snippet}
				</EntityView>

				{#if candidate == null}
					<p data-text="muted">Provider unavailable. This saved connection is read-only.</p>
				{/if}

				<Boundary
					failure={connectionFailure == null ? undefined : {
						error: new Error(connectionFailure),
					}}
					boundaryKey={`Wallet connection ${connectionKey}`}
				/>

				{#if (
					connection.status === BlockheadConnectionStatus.Connecting
					&& candidate?.connectionUri
				)}
					<p>
						<button
							type="button"
							onclick={async () => {
								walletControlFailure = undefined
								walletControlStatus = 'Opening wallet application.'
								try {
									await walletRuntime.openWalletConnectApplication(
										candidate.connectionUri
									)
									walletControlStatus = 'Wallet application opened.'
								}
								catch (error) {
									walletControlStatus = ''
									walletControlFailure = {
										error: normalizeBoundaryError(error),
									}
								}
							}}
						>
							Open {candidate.name} to continue
						</button>
						<button
							type="button"
							onclick={async () => {
								await navigator.clipboard.writeText(candidate.connectionUri)
								walletControlStatus = 'WalletConnect URI copied.'
							}}
						>
							Copy connection URI
						</button>
					</p>
					<output aria-live="polite">
						<TruncatedValue value={candidate.connectionUri} />
					</output>
				{/if}

				{#if connection.status === BlockheadConnectionStatus.Connected && connection.accounts.length > 0}
					<fieldset
						data-column="gap-1"
						data-wallet-action="select-account"
						disabled={walletAccountSelectionPending}
						aria-busy={walletAccountSelectionPending}
					>
						<legend>Active account and network</legend>

						{#each connection.accounts as account (`${account.namespace}:${account.reference}:${account.accountAddress}`)}
							<label
								data-card
								data-row="start align-center gap-1"
							>
								<input
									type="radio"
									data-wallet-action="select-account"
									name={`${id}-${connectionKey}-active-account`}
									checked={
										!walletAccountSelectionPending
										&& connection.selected
										&& connection.activeAccount?.namespace === account.namespace
										&& connection.activeAccount.reference === account.reference
										&& connection.activeAccount.accountAddress === account.accountAddress
									}
									onchange={async () => {
										walletAccountSelectionPending = true
										walletControlFailure = undefined
										try {
											await walletRuntime.selectAccount(connectionKey, account)
										} catch (error) {
											walletControlFailure = { error: normalizeBoundaryError(error) }
										} finally {
											walletAccountSelectionPending = false
										}
									}}
								/>
								<TruncatedValue value={account.accountAddress} />
								<span data-text="muted">{account.namespace}:{account.reference}</span>
							</label>
						{/each}
					</fieldset>
				{/if}

				{#if (
					connection.status === BlockheadConnectionStatus.Connected
					&& connection.selected
					&& candidate?.capabilities.includes(WalletCapability.SignMessage)
					&& connection.activeAccount?.namespace === 'eip155'
				)}
					<Boundary
						failure={walletRequestFailure}
						boundaryKey="Wallet message signing"
					>
						<form
							data-wallet-action="sign-message"
							onsubmit={async (event) => {
								event.preventDefault()
								const form = event.currentTarget
								walletRequestFailure = undefined
								walletRequestPending = true
								walletControlStatus = 'Wallet request pending.'
								try {
									const submittedAt = Date.now()
									const result = await walletRuntime.signMessage({
										connectionKey,
										message: String(new FormData(form).get('message')),
										authorityPresentation: {
											submittedAt,
										},
									})
									walletControlStatus = `Message signed by ${result.accountAddress}. Authority and dispatch history were saved.`
									form.reset()
								}
								catch (error) {
									walletControlStatus = ''
									walletRequestFailure = {
										error: normalizeBoundaryError(error),
									}
								}
								finally {
									walletRequestPending = false
								}
							}}
						>
							<label for={`${id}-${connectionKey}-message`}>Message to sign</label>
							<input
								id={`${id}-${connectionKey}-message`}
								name="message"
								autocomplete="off"
								required
							/>
							<button
								type="submit"
								data-wallet-action="sign-message"
								disabled={walletRequestPending}
							>
								Sign message
							</button>
						</form>
					</Boundary>
				{/if}

				{#if connection.status === BlockheadConnectionStatus.Connected && connection.selected && connection.activeAccount?.namespace === 'eip155' && connection.activeAccount.capabilities.includes(WalletCapability.SendTransaction)}
					{#key `${connectionKey}:${connection.activeAccount.reference}:${connection.activeAccount.accountAddress}`}
						<WalletTransactionForm {connectionKey} account={connection.activeAccount} />
					{/key}
				{/if}

				<div data-row="start wrap gap-2">
					{#if (
						connection.status === BlockheadConnectionStatus.Error
						|| connection.status === BlockheadConnectionStatus.Disconnected
					) && walletRuntime.candidates.some((candidate) => (
						candidate.id === connection.walletId
						&& candidate.capabilities.includes(WalletCapability.Reconnect)
					))}
						<button
							type="button"
							data-wallet-action="retry"
							onclick={() => walletRuntime.connect(connection.walletId)}
						>
							Retry {connection.status === BlockheadConnectionStatus.Error ? 'connection' : 'connect'}
						</button>
					{/if}

					{#if connection.status === BlockheadConnectionStatus.Connected && candidate != null}
						<button
							type="button"
							data-wallet-action="disconnect"
							aria-busy={walletConnectionMutationPending === connectionKey}
							disabled={walletConnectionMutationPending === connectionKey}
							onclick={async () => {
								walletConnectionMutationPending = connectionKey
								walletControlFailure = undefined
								walletControlStatus = 'Disconnecting wallet.'
								try {
									await walletRuntime.disconnect(connectionKey)
									walletControlStatus = 'Wallet disconnected.'
								} catch (error) {
									walletControlStatus = ''
									walletControlFailure = { error: normalizeBoundaryError(error) }
								} finally {
									walletConnectionMutationPending = undefined
								}
							}}
						>
							{candidate.capabilities.includes(WalletCapability.Disconnect) ?
								'Disconnect wallet'
							:
								'Disconnect from Blockhead'}
						</button>
					{:else}
						<button
							type="button"
							data-wallet-action="remove"
							onclick={() => walletRuntime.remove(connectionKey)}
						>
							{connection.status === BlockheadConnectionStatus.Connecting ?
								'Cancel connection'
							:
								'Remove connection'}
						</button>
					{/if}
				</div>
			</article>
		{/each}
	{/if}

	{#if availableCandidates.length > 0}
		{#each availableCandidates.toSorted((candidateA, candidateB) => candidateA.name.localeCompare(candidateB.name)) as candidate (candidate.id)}
			<article
				data-column-item="flexible"
				data-card
				data-scroll-container
				data-wallet-id={candidate.id}
				data-wallet-name={candidate.name}
				data-wallet-state="candidate"
			>
				<BlockheadWalletView
					selection={select(EntityType.BlockheadWallet, {
						id: candidate.id,
					})}
					prefetched={{
						[EntityMetaKey.Selector]: {
							id: candidate.id,
						},
						id: candidate.id,
						name: candidate.name,
						protocol: candidate.protocol,
					}}
					layout={EntityLayout.SummaryInline}
					open={false}
				/>

				{#if candidate.capabilities.includes(WalletCapability.Connect)}
					<button
						type="button"
						data-wallet-action="connect"
						data-row="start align-center gap-1"
						onclick={() => walletRuntime.connect(candidate.id)}
					>
						{#if candidate.icon}
							<Icon
								src={candidate.icon}
								alt=""
							/>
						{/if}
						<span>Connect {candidate.name}</span>
					</button>
				{:else}
					<output aria-live="polite">Detected</output>
				{/if}
			</article>
		{/each}
	{/if}
{/if}

<ResourceBoundary resource={walletRequests.count}>
	{#snippet children(requestCount)}
		{#if requestCount > 0}
			<BlockheadWalletRequestsView
				selection={walletRequests}
				countResource={walletRequests.count}
				title="Wallet request history"
				id={`${id}-requests`}
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/if}
	{/snippet}

	{#snippet Pending()}{/snippet}
</ResourceBoundary>
