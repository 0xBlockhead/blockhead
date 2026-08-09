<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.AtprotoNetwork, {
		scope: 'AtprotoNetwork',
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoNetworkView from '$/views/AtprotoNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'AT Protocol' : pageSelection.entity.protocolName || 'AT Protocol'} • AT Protocol • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoNetworkView
		selection={pageSelection}
	/>
</Page>
