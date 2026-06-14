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
		selector={
			decodeURIComponent(params.localAccountId).includes('@') ?
				{
					instanceOrigin: decodeURIComponent(params.instanceOrigin),
					acct: decodeURIComponent(params.localAccountId),
				}
			:
				{
					instanceOrigin: decodeURIComponent(params.instanceOrigin),
					localAccountId: decodeURIComponent(params.localAccountId),
				}
		}
	/>
</Page>
