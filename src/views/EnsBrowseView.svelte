<script lang="ts">
	// Types/constants
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import { TransportType } from '$/constants/TransportType.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import {
		normalizeEnsName,
		resolveEnsReverseForRpcUrl,
	} from '$/sources/Voltaire/JsonRpc/ens.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// Functions
	const ethereumRpcUrl = (
		import.meta.env.PUBLIC_ETH_RPC_URL !== undefined
		&& String(import.meta.env.PUBLIC_ETH_RPC_URL).trim().length > 0 ?
			String(import.meta.env.PUBLIC_ETH_RPC_URL).trim()
		:
			undefined
	)

	const onNameSubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const trimmed = searchInput.trim()
		if (!trimmed) return
		searchError = null
		searchTerm = trimmed
	}


	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	let searchInput = $state('')

	let searchTerm = $state<string | undefined>(undefined)

	let searchError = $state<string | null>(null)

	let reverseInput = $state('')

	let reverseResult = $state<{ address: `0x${string}`, name: string } | null>(null)

	let reverseLoading = $state(false)

	let reverseError = $state<string | null>(null)

	const onReverseSubmit = async (event: SubmitEvent) => {
		event.preventDefault()
		const trimmed = reverseInput.trim()
		if (!trimmed) return
		if (ethereumRpcUrl === undefined) {
			reverseError = 'Set PUBLIC_ETH_RPC_URL for reverse lookup'
			return
		}
		const raw = (
			trimmed.startsWith('0x') ?
				trimmed
			:
				`0x${trimmed}`
		).toLowerCase()
		if (!/^0x[0-9a-f]{40}$/.test(raw)) {
			reverseError = 'Invalid address'
			return
		}
		const address = raw as `0x${string}`
		reverseLoading = true
		reverseError = null
		reverseResult = null
		try {
			const name = await resolveEnsReverseForRpcUrl({
				rpcUrl: ethereumRpcUrl,
				transportType: TransportType.Http,
				address,
			})
			if (name) {
				reverseResult = {
					address,
					name: normalizeEnsName(name),
				}
			} else {
				reverseError = 'No primary name set for this address'
			}
		} catch (error) {
			reverseError = error instanceof Error ? error.message : String(error)
		} finally {
			reverseLoading = false
		}
	}


	// (Derived)
	const ensSearch = $derived(
		searchTerm == null ?
			undefined
		:
			useEntity(
				EntityType.EnsSearch,
				{
					query: searchTerm,
				},
				{
					$$ensNames: {
						$: [
							Source.TheGraph_Graphql,
						],
						$limit: 32,
					},
				},
			),
	)

	const ensSearchMatches = $derived(
		ensSearch == null ?
			undefined
		:
			derive(
				ensSearch,
				(ensSearch) => (
					ensSearch.$$ensNames ?? []
				),
			),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


<section
	class="ens-browser"
	data-column
>
	<p data-text="muted">
		Resolve ENS names and reverse records on Ethereum mainnet (chain {String(ensEthereumChainId)}).
		<a
			data-link
			href="https://docs.ens.domains"
			rel="noopener noreferrer"
			target="_blank"
		>ENS docs</a>.
	</p>

	<form
		class="ens-browser-form"
		data-card
		data-column
		onsubmit={onNameSubmit}
	>
		<div
			class="ens-browser-fieldset"
			data-column
		>
			<label for="ens-name-input">
				Look up name
			</label>
			<div data-row="wrap gap-2 align-center">
				<input
					id="ens-name-input"
					type="text"
					bind:value={searchInput}
					placeholder="vitalik.eth"
				/>
				<button type="submit">
					Look up
				</button>
			</div>
		</div>
		{#if searchError}
			<p data-text="muted">{searchError}</p>
		{/if}
	</form>

	{#if ensSearchMatches !== undefined}
		<EntitiesList
			collapsible={false}
			entityType={EntityType.EnsName}
			href={resolve('/ens')}
			id="ens-substring-search-results"
			showSummary={true}
			title={`Substring matches for "${searchTerm}"`}
		>
			{#snippet body()}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EnsName}
					getKey={(ensName) => ensName[EntityMetaKey.Id].name}
					getSortValue={(ensName) => ensName[EntityMetaKey.Id].name}
					href={resolve('/ens')}
					id="ens-substring-search-results-items"
					open={true}
					resource={ensSearchMatches}
					title={`Substring matches for "${searchTerm}"`}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No ENS names contain "{searchTerm}".
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EnsView
							entityId={item[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}
		</EntitiesList>
	{/if}

	<form
		class="ens-browser-form"
		data-card
		data-column
		onsubmit={onReverseSubmit}
	>
		<div
			class="ens-browser-fieldset"
			data-column
		>
			<label for="ens-address-input">
				Reverse lookup
			</label>
			<div data-row="wrap gap-2 align-center">
				<input
					id="ens-address-input"
					type="text"
					bind:value={reverseInput}
					disabled={reverseLoading}
					placeholder="0x…"
				/>
				<button
					disabled={reverseLoading}
					type="submit"
				>
					{reverseLoading ? 'Resolving…' : 'Resolve'}
				</button>
			</div>
		</div>
		{#if reverseError}
			<p data-text="muted">{reverseError}</p>
		{/if}

		{#if reverseResult}
			<dl data-column-item="center">
				<div>
					<dt>Primary name</dt>
					<dd>
						<a
							data-link
							href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
								ensName: reverseResult.name,
							})}
						>{reverseResult.name}</a>
					</dd>
				</div>
				<div>
					<dt>Address</dt>
					<dd>
						<EvmNetworkAccountView
							entityId={{
								$network: { caip2: { namespace: 'eip155' as const, reference: String(ensEthereumChainId) } },
								$actor: { address: reverseResult.address },
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
					</dd>
				</div>
			</dl>
		{/if}
	</form>
</section>


<style>
	.ens-browser {
		gap: 1rem;
	}

	.ens-browser-form {
		gap: 0.75rem;
	}

	.ens-browser-fieldset {
		gap: 0.5rem;
	}
</style>
