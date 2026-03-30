<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve('/contracts')}
		id="contracts"
	/>
</Page>
