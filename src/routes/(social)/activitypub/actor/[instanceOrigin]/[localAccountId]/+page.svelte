<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

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
		href={resolve('/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localAccountId: encodeURIComponent(entityId.localAccountId),
		})}
	>
	</ActivityPubActorView>
</Page>
