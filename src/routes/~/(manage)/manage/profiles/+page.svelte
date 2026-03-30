<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
</script>


<Page>
	<BlockheadSessionsView
		href={resolve('/~/manage/profiles')}
		id="profiles"
	/>
</Page>
