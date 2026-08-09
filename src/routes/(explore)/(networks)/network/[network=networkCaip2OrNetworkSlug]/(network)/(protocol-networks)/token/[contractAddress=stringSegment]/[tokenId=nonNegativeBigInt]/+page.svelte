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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosTokenView from '$/views/TezosTokenView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos token'} • tezos token • Blockhead</title>
</svelte:head>


<Page>
	<TezosTokenView
		selection={select(EntityType.TezosToken, data.selector)}
	/>
</Page>
