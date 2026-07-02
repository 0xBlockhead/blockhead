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
	import CosmosModuleView from '$/views/CosmosModuleView.svelte'
</script>


<svelte:head>
	<title>Cosmos module • Blockhead</title>
</svelte:head>


<Page>
	<CosmosModuleView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/module/[moduleName]', {
				caip2: params.caip2,
				moduleName: params.moduleName,
			})
		}
		selection={
			select(EntityType.CosmosModule, data.selector, {
				fields: {
					$authority: true,
				},
			})
		}
	/>
</Page>
