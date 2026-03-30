<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
</script>


<Page>
	<BlockheadSourcesView
		href={resolve('/~/manage/sources')}
		id="sources"
	/>
</Page>
