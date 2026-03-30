<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<Page>
	<EvmErrorView
		entityId={{ hex: params.hex as `0x${string}` }}
		href={resolve('/evm/errors')}
	/>
</Page>
