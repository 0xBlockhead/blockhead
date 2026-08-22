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
	import NftTokenView from '$/views/NftTokenView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'NFT token'} • NFT token • Blockhead</title>
</svelte:head>


<Page>
	<NftTokenView
		selection={
			select(EntityType.NftToken, {
				$collection: data.selector,
				tokenKey: params.tokenKey,
			})
		}
	/>
</Page>
