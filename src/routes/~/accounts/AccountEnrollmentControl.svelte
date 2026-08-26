<script lang="ts">
	// Types/constants
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { caip2ParamValueFromString } from '$/lib/caip2.ts'
	import {
		deleteLocalBlockheadAccount,
		writeLocalBlockheadAccount,
	} from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'


	// State
	let network = $state('')
	let address = $state('')
	let status = $state('')
</script>


<form
	data-card
	data-column="gap-2"
	onsubmit={async (event) => {
		event.preventDefault()
		const caip2 = caip2ParamValueFromString(network.trim())
		if (caip2 === undefined || networkByCaip2[network.trim()] == null)
			return

		const account = {
			...caip2,
			accountAddress: address.trim(),
		}
		if (event.submitter?.getAttribute('value') === 'remove')
			await deleteLocalBlockheadAccount(getAppClient(), account)
		else
			await writeLocalBlockheadAccount(getAppClient(), account)
		status = `${event.submitter?.getAttribute('value') === 'remove' ? 'Removed' : 'Added'} ${network.trim()}:${address.trim()}.`
		address = ''
	}}
>
	<header data-row="between wrap align-center gap-2">
		<h2>Manage accounts</h2>
	</header>

	<label for="account-network">Network (CAIP-2)</label>
	<input
		id="account-network"
		name="network"
		bind:value={network}
		autocomplete="off"
		list="account-network-options"
		placeholder="eip155:1"
		pattern="[^\s:]+:[^\s:]+"
		required
		oninput={(event) => {
			status = ''
			event.currentTarget.setCustomValidity('')
		}}
		onchange={(event) => {
			event.currentTarget.setCustomValidity(
				networkByCaip2[event.currentTarget.value.trim()] == null ?
					'Choose a supported CAIP-2 network.'
				:
					''
			)
		}}
	/>
	<datalist id="account-network-options">
		{#each Object.entries(networkByCaip2) as [caip2, candidate] (caip2)}
			<option value={caip2}>{candidate.name}</option>
		{/each}
	</datalist>

	<label for="account-address">Account address</label>
	<input
		id="account-address"
		name="address"
		bind:value={address}
		autocomplete="off"
		pattern="\S+"
		required
		oninput={() => {
			status = ''
		}}
	/>

	<div data-row="wrap gap-2">
		<button
			type="submit"
			value="add"
		>
			Add account
		</button>

		<button
			type="submit"
			value="remove"
		>
			Remove account
		</button>
	</div>

	{#if status !== ''}
		<p role="status">{status}</p>
	{/if}
</form>
