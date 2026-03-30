<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<Page>
	<EvmSelectorView
		entityId={{ hex: params.hex as `0x${string}` }}
		href={resolve('/evm/selectors')}
	/>
</Page>
