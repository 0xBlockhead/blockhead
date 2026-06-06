<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<Page>
	<ActivityPubActorView
		entityId={
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
	>
	</ActivityPubActorView>
</Page>
