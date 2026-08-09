<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'allowance'} • allowance • Blockhead</title>
</svelte:head>


<Page>
	<EvmActorCoinAllowanceView
		selection={
			select(EntityType.EvmActorCoinAllowance, data.selector, {
				sources: [
					Source.EnvioHyperSync_RawHttp,
					Source.SqdPortal_RawHttp,
					Source.Voltaire_JsonRpc,
				],
			})
		}
	/>
</Page>
