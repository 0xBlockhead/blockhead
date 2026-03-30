<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	const chainId = 1
	const placeholderAddress = (
		'0x0000000000000000000000000000000000000000'
	) as `0x${string}`

	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<Page>
	<EvmContractView
		entityId={{
			$network: { chainId },
			address: placeholderAddress,
		}}
		href={resolve(`/ens/name/${params.ensName}/resolver`)}
	/>
</Page>
