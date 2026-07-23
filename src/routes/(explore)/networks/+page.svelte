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
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<svelte:head>
	<title>Networks • Blockhead</title>
</svelte:head>


<Page>
	<NetworksView
		href={resolve('/networks')}
		title='Networks'
		selection={
			select(EntityType._Global, {
				scope: '$$networks',
			})
				.$$networks({
					sources: [
						Source.Constants_Internal,
					],
				})
		}
		countResource={
			select(EntityType._Global, {
				scope: '$$networks',
			})
				.$$networks({
					sources: [
						Source.Constants_Internal,
					],
				}).count
		}
		id='networks'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
