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
	import HederaContractActionView from '$/views/HederaContractActionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'hedera contract action'} • hedera contract action • Blockhead</title>
</svelte:head>


<Page>
	<HederaContractActionView
		selection={
			select(EntityType.HederaContractAction, {
				$result: data.selector,
				callDepth: Number(params.callDepth),
				callIndex: Number(params.callIndex),
			})
		}
	/>
</Page>
