<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalXNetworkView from '$/views/_GlobalXNetworkView.svelte'
</script>


<svelte:head>
	<title>global X network • global X network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalXNetworkView
		selection={
			select(EntityType._GlobalXNetwork, {
				scope: 'global',
			}, {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			})
		}
	/>
</Page>
