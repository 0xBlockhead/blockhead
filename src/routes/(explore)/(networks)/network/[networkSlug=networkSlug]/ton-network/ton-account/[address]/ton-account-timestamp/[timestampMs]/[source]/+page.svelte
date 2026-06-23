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
	import TonAccount_TimestampView from '$/views/TonAccount_TimestampView.svelte'
</script>


<Page>
	<TonAccount_TimestampView
		selection={select(EntityType.TonAccount_Timestamp, data.selector)}
	/>
</Page>
