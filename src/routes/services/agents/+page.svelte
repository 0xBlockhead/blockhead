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
	import EvmNftsView from '$/views/EvmNftsView.svelte'
</script>


<svelte:head>
	<title>ERC-8004 Registrations • Blockhead</title>
</svelte:head>


<Page>
	<EvmNftsView
		href={resolve('/services/agents')}
		title='ERC-8004 Registrations'
		selection={
			select(EntityType._Global, {
				scope: '$$eip8004Services',
			}).$$eip8004Services({
				sources: [
					Source.Eip8004Scan_Rest,
				],
				limit: 100,
				count: true,
			})
		}
		id='eip8004-services'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
