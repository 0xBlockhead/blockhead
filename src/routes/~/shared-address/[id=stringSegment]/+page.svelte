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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSharedAddressView from '$/views/BlockheadSharedAddressView.svelte'
</script>


<svelte:head>
	<title>blockhead shared address • blockhead shared address • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSharedAddressView
		selection={
			select(EntityType.BlockheadSharedAddress, {
				id: params.id,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
