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
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<Page>
	<XrplAccountView
		selection={select(EntityType.XrplAccount, data.selector)}
	/>
</Page>
