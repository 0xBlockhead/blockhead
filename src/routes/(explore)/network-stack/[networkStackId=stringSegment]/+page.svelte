<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	<title>{(pageSelection.entity == null ? [String(({
		networkStackId: params.networkStackId,
	}.networkStackId) ?? '')].filter(Boolean).join(' ') || 'network stack' : [String((({ ...{
		networkStackId: params.networkStackId,
	}, ...pageSelection.entity }).label) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		networkStackId: params.networkStackId,
	}, ...pageSelection.entity }).networkStackId) ?? '')].filter(Boolean).join(' ') || 'network stack')} • network stack • Blockhead</title>
</svelte:head>


<Page>
	<NetworkStackView
		href={
			resolve('/network-stack/[networkStackId=stringSegment]', {
				networkStackId: params.networkStackId,
			})
		}
		selection={pageSelection}
	/>
</Page>
