<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmPrecompilesView from '$/views/EvmPrecompilesView.svelte'
</script>


<svelte:head>
	<title>Precompiles • Blockhead</title>
</svelte:head>


<Page>
	<EvmPrecompilesView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/precompiles', {
				caip2: params.caip2,
			})
		}
		title='Precompiles'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.EvmContract>('$$precompiles')
		}
		id='EvmPrecompilesView-page'
	/>
</Page>
