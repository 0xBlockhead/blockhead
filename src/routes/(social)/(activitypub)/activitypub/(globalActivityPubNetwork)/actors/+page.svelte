<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorsView from '$/views/ActivityPubActorsView.svelte'
</script>


<svelte:head>
	<title>ActivityPub actors • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActorsView
		href={resolve('/activitypub/actors')}
		title='ActivityPub actors'
		selection={
			select(EntityType._GlobalActivityPubNetwork, {
				scope: '_GlobalActivityPubNetwork',
			}).$$observedActors({
				sources: [
					Source.Mastodon_Rest,
				],
			})
		}
		id='observed-actors'
	/>
</Page>
