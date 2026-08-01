<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<svelte:head>
	<title>X users • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.XNetwork, {
		scope: 'XNetwork',
	}).$$xUsers}

	<XUsersView
		href={resolve('/(social)/(x)/x/(xNetwork)/users')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='x-users'
	/>
</Page>
