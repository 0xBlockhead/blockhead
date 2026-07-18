<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<svelte:head>
	<title>Proposals • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationRealmsView
		href={resolve('/proposals')}
		title='Proposals'
		selection={
			select(EntityType._Global, {
				scope: '$$specificationRealms',
			}).$$specificationRealms({
				count: true,
			})
		}
		id='specification-realms'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
