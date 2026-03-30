<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<Page>
	<EvmErrorsView
		href={resolve('/evm/errors')}
		id="errors"
	/>
</Page>
