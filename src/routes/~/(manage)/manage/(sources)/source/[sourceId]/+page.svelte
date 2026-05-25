<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<Page>
	<BlockheadSourceView
		sourceId={params.sourceId}
	/>
</Page>
