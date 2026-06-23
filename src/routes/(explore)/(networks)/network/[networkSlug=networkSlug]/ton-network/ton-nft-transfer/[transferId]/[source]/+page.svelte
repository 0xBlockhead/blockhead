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
	import TonNftTransferView from '$/views/TonNftTransferView.svelte'
</script>


<Page>
	<TonNftTransferView
		selection={select(EntityType.TonNftTransfer, data.selector)}
	/>
</Page>
