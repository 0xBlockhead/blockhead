<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.WalletConnectionMethod, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import WalletConnectionMethodView from '$/views/WalletConnectionMethodView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'wallet connection method' : pageSelection.entity.label || 'wallet connection method'} • wallet connection method • Blockhead</title>
</svelte:head>


<Page>
	<WalletConnectionMethodView
		selection={pageSelection}
	/>
</Page>
