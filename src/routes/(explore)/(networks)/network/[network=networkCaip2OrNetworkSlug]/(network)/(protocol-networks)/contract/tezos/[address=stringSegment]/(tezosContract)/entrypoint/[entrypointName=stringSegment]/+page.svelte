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


	// Components
	import Page from '$/components/Page.svelte'
	import TezosEntrypointView from '$/views/TezosEntrypointView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos entrypoint'} • tezos entrypoint • Blockhead</title>
</svelte:head>


<Page>
	<TezosEntrypointView
		selection={
			select(EntityType.TezosEntrypoint, {
				$contract: data.selector,
				entrypointName: params.entrypointName,
			})
		}
	/>
</Page>
