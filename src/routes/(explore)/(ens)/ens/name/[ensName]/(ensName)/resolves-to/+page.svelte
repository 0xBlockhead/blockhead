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
	import ActorView from '$/views/ActorView.svelte'
</script>


<Page>
	<ActorView
		entityId={{
			$network: { chainId },
			address: placeholderAddress,
		}}
		href={resolve(`/ens/name/${params.ensName}/resolves-to`)}
	/>
</Page>
