<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import XmtpView from '$/views/XmtpView.svelte'
</script>


<Page>
	<XmtpView
		selection={select(EntityType.XmtpNetwork, {
			scope: 'XmtpNetwork',
		})}
	/>
</Page>
