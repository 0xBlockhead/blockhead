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
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<Page>
	<Coin_TimestampView
		selection={select(EntityType.Coin_Timestamp, data.selector)}
	/>
</Page>
