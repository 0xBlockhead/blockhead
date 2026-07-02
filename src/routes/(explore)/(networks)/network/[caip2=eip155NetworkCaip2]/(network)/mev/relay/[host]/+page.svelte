<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<svelte:head>
	<title>MEV relay • Blockhead</title>
</svelte:head>


<Page>
	<MevRelayView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
				caip2: params.caip2,
				host: params.host,
			})
		}
		selection={
			select(EntityType.MevRelay, data.selector, {
				fields: {
					url: true,
				},
			})
		}
	/>
</Page>
