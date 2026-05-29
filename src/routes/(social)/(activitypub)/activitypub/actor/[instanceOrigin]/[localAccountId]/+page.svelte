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
	import ActivityPubEvmAccountView from '$/views/ActivityPubEvmAccountView.svelte'
</script>


<Page>
	<ActivityPubEvmAccountView
		{entityId}
	>
	</ActivityPubEvmAccountView>
</Page>
