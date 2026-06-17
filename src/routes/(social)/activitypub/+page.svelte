<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubView from '$/views/ActivityPubView.svelte'
</script>


<Page>
	<ActivityPubView
		selector={{
			scope: 'ActivityPubNetwork',
		}}
		open={false}
	/>
</Page>
