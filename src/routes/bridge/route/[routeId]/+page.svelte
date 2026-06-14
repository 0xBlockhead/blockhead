<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<Page>
	<BridgeRouteView selector={data.selector} />
</Page>
