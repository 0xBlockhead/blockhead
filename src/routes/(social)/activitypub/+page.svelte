<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubView from '$/views/ActivityPubView.svelte'
</script>


<Page>
	<ActivityPubView
		entityId={{
			scope: 'ActivityPubNetwork',
		}}
	/>
</Page>
