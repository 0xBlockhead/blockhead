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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.WormholeVaa, {
		emitterChain: Number(params.emitterChain),
		emitter: params.emitter,
		sequence: params.sequence,
	}, {
		sources: [
			Source.Wormholescan,
		],
		fields: {
			digest: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import WormholeVaaView from '$/views/WormholeVaaView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Wormhole VAA' : pageSelection.entity.digest || 'Wormhole VAA'} • Wormhole VAA • Blockhead</title>
</svelte:head>


<Page>
	<WormholeVaaView
		selection={pageSelection}
	/>
</Page>
