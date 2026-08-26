<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<svelte:head>
	<title>X posts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XNetwork, {
		scope: 'XNetwork',
	}).$$xPosts}

	<XPostsView
		href={resolve('/(social)/(x)/x/(xNetwork)/posts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='x-posts'
	/>
</Page>
