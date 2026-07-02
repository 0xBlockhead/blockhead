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
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


<svelte:head>
	<title>MEV builder • Blockhead</title>
</svelte:head>


<Page>
	<MevBuilderView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
				caip2: params.caip2,
				builderPubkey: params.builderPubkey,
			})
		}
		selection={select(EntityType.MevBuilder, data.selector)}
	/>
</Page>
