<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
</script>


<Page>
	<EvmSelectorsView
		href={resolve('/evm/selectors')}
		id="selectors"
	/>
</Page>
