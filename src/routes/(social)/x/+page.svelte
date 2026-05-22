<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import XView from '$/views/XView.svelte'
</script>


<Page>
	<XView
		entityId={{
			scope: 'XNetwork',
		}}
		href={resolve('/x')}
	/>
</Page>
