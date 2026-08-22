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
	import DogecoinAuxPowParentBlockHeaderView from '$/views/DogecoinAuxPowParentBlockHeaderView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'dogecoin aux pow parent block header'} • dogecoin aux pow parent block header • Blockhead</title>
</svelte:head>


<Page>
	<DogecoinAuxPowParentBlockHeaderView
		selection={
			select(EntityType.DogecoinAuxPowParentBlockHeader, {
				$auxPow: data.selector,
			}, {
				sources: [
					Source.DogecoinCore_JsonRpc,
				],
			})
		}
	/>
</Page>
