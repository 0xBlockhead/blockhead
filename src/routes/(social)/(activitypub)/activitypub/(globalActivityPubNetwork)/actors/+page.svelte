<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
</script>


<svelte:head>
	<title>ActivityPub actors • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalActivityPubNetwork, {
		scope: '_GlobalActivityPubNetwork',
	})
		.$$observedActors({
			sources: [
				Source.Mastodon_Rest,
			],
		})}

	<ActivityPubActorsView
		href={resolve('/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actors')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-actors'
	/>
</Page>
