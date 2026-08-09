<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalArweaveNetworkView from '$/views/_GlobalArweaveNetworkView.svelte'
</script>


<svelte:head>
	<title>global Arweave network • global Arweave network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalArweaveNetworkView
		selection={
			select(EntityType._GlobalArweaveNetwork, {
				scope: 'global',
			}, {
				sources: [
					Source.Arweave_Graphql,
					Source.Arweave_Rest,
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
