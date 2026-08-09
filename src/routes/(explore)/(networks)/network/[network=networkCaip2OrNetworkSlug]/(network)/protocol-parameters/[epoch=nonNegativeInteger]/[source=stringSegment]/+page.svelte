<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoProtocolParameters_EpochView from '$/views/CardanoProtocolParameters_EpochView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Cardano protocol parameters epoch'} • Cardano protocol parameters epoch • Blockhead</title>
</svelte:head>


<Page>
	<CardanoProtocolParameters_EpochView
		selection={
			select(EntityType.CardanoProtocolParameters_Epoch, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
