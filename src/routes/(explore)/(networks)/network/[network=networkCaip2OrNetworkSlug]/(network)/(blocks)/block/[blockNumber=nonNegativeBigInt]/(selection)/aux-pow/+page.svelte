<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'dogecoin block aux pow'} • dogecoin block aux pow • Blockhead</title>
</svelte:head>


<Page>
	<DogecoinBlockAuxPowView
		selection={
			select(EntityType.DogecoinBlockAuxPow, data.selector, {
				sources: [
					Source.DogecoinCore_JsonRpc,
				],
			})
		}
	/>
</Page>
