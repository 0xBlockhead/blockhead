<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<Page>
	<EvmCalldataView
		entityId={{ hex: params.hex as `0x${string}` }}
		href={resolve('/evm/calldata')}
	/>
</Page>
