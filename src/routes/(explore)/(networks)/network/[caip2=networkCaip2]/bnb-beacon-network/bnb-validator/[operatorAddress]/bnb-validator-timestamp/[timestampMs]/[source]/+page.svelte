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
	import BnbValidator_TimestampView from '$/views/BnbValidator_TimestampView.svelte'
</script>


<Page>
	<BnbValidator_TimestampView
		selection={select(EntityType.BnbValidator_Timestamp, data.selector)}
	/>
</Page>
