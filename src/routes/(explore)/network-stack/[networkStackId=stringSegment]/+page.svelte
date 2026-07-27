<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.NetworkStack, {
		networkStackId: params.networkStackId,
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkStackView from '$/views/NetworkStackView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? (pageSelection.entitySelector.networkStackId ?? '') || 'network stack' : pageSelection.entity.label || pageSelection.entitySelector.networkStackId || 'network stack')} • network stack • Blockhead</title>
</svelte:head>


<Page>
	<NetworkStackView
		selection={pageSelection}
	/>
</Page>
