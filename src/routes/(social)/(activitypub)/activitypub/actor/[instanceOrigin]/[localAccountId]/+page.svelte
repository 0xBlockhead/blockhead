<script lang="ts">
	// State
	let {
		params,
	} = $props()


	const entityId = $derived({
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localAccountId: decodeURIComponent(params.localAccountId),
	})


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<Page>
	<ActivityPubActorView
		{entityId}
	>
	</ActivityPubActorView>
</Page>
