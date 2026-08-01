<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<svelte:head>
	<title>Proposals • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$specificationRealms',
	}).$$specificationRealms}

	<SpecificationRealmsView
		href={resolve('/(proposals)/proposals')}
		title='Proposals'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='specification-realms'
	/>
</Page>
