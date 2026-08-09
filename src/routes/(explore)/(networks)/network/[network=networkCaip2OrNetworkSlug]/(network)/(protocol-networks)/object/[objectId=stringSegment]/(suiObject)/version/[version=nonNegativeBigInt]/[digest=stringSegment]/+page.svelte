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
	import SuiObjectVersionView from '$/views/SuiObjectVersionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Sui object version'} • Sui object version • Blockhead</title>
</svelte:head>


<Page>
	<SuiObjectVersionView
		selection={
			select(EntityType.SuiObjectVersion, {
				$network: data.selector,
				objectId: params.objectId,
				version: BigInt(params.version),
				digest: params.digest,
			})
		}
	/>
</Page>
