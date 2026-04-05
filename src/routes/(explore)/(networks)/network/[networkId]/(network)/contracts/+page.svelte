<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<section>
		<EvmContractsView
			href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', params)}
			id="contracts"
		/>
	</section>
</Page>
