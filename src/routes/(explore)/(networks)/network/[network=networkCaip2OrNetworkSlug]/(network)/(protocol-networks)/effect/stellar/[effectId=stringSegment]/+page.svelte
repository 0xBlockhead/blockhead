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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.StellarEffect, {
		$network: data.selector,
		effectId: params.effectId,
	}, {
		fields: {
			effectType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarEffectView from '$/views/StellarEffectView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.effectId ?? '') || 'stellar effect' : pageSelection.entity.effectType || pageSelection.entitySelector.effectId || 'stellar effect')} • stellar effect • Blockhead</title>
</svelte:head>


<Page>
	<StellarEffectView
		selection={pageSelection}
	/>
</Page>
