<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import LensView from '$/views/LensView.svelte'
</script>


<Page>
	<LensView
		entityId={{
			scope: 'LensNetwork',
		}}
		href={resolve('/lens')}
	/>
</Page>
