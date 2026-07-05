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
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<svelte:head>
	<title>Network • Blockhead</title>
</svelte:head>


<Page>
	<NetworkView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
				caip2: params.caip2,
			})
		}
		selection={
			select(EntityType.Network, data.selector, {
				fields: {
					$icon: true,
					name: true,
					namespace: true,
					$networkStack: true,
					environment: true,
				},
			})
		}
	/>
</Page>
