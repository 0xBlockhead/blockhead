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
	import NetworkStackView from '$/views/NetworkStackView.svelte'
</script>


<svelte:head>
	<title>network stack • Blockhead</title>
</svelte:head>


<Page>
	<NetworkStackView
		href={
			resolve('/(explore)/network-stack/[networkStackId]', {
				networkStackId: params.networkStackId,
			})
		}
		selection={
			select(EntityType.NetworkStack, data.selector, {
				fields: {
					label: true,
				},
			})
		}
	/>
</Page>
