<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<Page>
	<EvmTopicsView
		href={resolve('/evm/topics')}
		id="topics"
	/>
</Page>
