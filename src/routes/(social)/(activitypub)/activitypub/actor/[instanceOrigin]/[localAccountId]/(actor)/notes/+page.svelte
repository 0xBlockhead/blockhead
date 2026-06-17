<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<ActivityPubActorView
		selector={{
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localAccountId: decodeURIComponent(params.localAccountId),
		}}
	/>
</Page>
