<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<Page>
	<BlockheadPanelTreesView
		href={resolve('/~/dashboards')}
		id="dashboards"
	/>
</Page>
