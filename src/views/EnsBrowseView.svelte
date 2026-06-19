<script lang="ts">
	// Types/constants
	import { ChainId } from '$/constants/ChainId.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	const onNameSubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const trimmed = searchInput.trim()
		if (!trimmed) return
		searchError = null
		searchTerm = trimmed
	}

	let searchInput = $state('')

	let searchTerm = $state<string | undefined>(undefined)

	let searchError = $state<string | null>(null)

	let reverseInput = $state('')

	let reverseAddress = $state<`0x${string}` | undefined>(undefined)

	let reverseError = $state<string | null>(null)

	const onReverseSubmit = (event: SubmitEvent) => {
		event.preventDefault()
		const trimmed = reverseInput.trim()
		if (!trimmed) return
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
		reverseError = null
		reverseAddress = EvmAddress.assert(raw)
	}


	// (Derived)
	const ensSearchMatches = $derived(
		searchTerm == null ?
			undefined
		:
			select(
				EntityType.EnsSearch,
				{
					query: searchTerm,
				}
			).$$ensNames({
				sources: [
					Source.TheGraph_Graphql,
				],
				limit: 32,
			}),
	)

	const reverseAccount = $derived(
		reverseAddress == null ?
			undefined
		:
			select(EntityType.EvmAccount,
				{
					address: reverseAddress,
				},
				({ fields: { $primaryName: ({ sources: [
							Source.Voltaire_JsonRpc,
						] }) } }),
			),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EnsView from '$/views/EnsView.svelte'
</script>


<section
	class="ens-browser"
	data-column
>
	<p data-text="muted">
		Resolve ENS names and reverse records on Ethereum mainnet (chain {String(ChainId.Ethereum)}).
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
					getKey={(ensName) => ensName.entitySelector.name}
					getSortValue={(ensName) => ensName.entitySelector.name}
					href={resolve('/ens')}
					id="ens-substring-search-results-items"
					resource={ensSearchMatches}
					open={true}
					title={`Substring matches for "${searchTerm}"`}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No ENS names contain "{searchTerm}".
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EnsView
							selection={select(EntityType.EnsName, item.entitySelector)}
							layout={EntityLayout.Summary}

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
					placeholder="0x…"
				/>
				<button
					type="submit"
				>
					Resolve
				</button>
			</div>
		</div>
		{#if reverseError}
			<p data-text="muted">{reverseError}</p>
		{/if}

		{#if reverseAddress != null && reverseAccount != null}
			<ResourceBoundary
				resource={reverseAccount}
				placeholderText="Loading reverse ENS…"
			>
				{#snippet children(reverseAccount)}
					{#if reverseAccount.fields.$primaryName != null}
						<dl data-column-item="center">
							<div>
								<dt>Primary name</dt>
								<dd>
									<a
										data-link
										href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
											ensName: reverseAccount.fields.$primaryName[EntityMetaKey.Selector].name,
										})}
									>{reverseAccount.fields.$primaryName[EntityMetaKey.Selector].name}</a>
								</dd>
							</div>
						</dl>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<dl data-column-item="center">
				<div>
					<dt>Address</dt>
					<dd>
						<EvmNetworkAccountView
							selection={select(EntityType.EvmNetworkAccount, {
								$network: { caip2: { namespace: 'eip155' as const, reference: String(ChainId.Ethereum) } },
								$actor: { address: reverseAddress },
							})}
							layout={EntityLayout.Title}

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
