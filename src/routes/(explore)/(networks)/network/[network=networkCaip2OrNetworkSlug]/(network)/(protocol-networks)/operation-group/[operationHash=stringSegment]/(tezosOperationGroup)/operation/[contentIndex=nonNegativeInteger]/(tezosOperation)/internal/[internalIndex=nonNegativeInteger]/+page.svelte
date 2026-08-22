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
	import TezosInternalOperationView from '$/views/TezosInternalOperationView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos internal operation'} • tezos internal operation • Blockhead</title>
</svelte:head>


<Page>
	<TezosInternalOperationView
		selection={
			select(EntityType.TezosInternalOperation, {
				$parentOperation: data.selector,
				internalIndex: Number(params.internalIndex),
			})
		}
	/>
</Page>
