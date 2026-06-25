<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Components
	import Page from '$/components/Page.svelte'
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<Page>
	<IpfsProtocolView
		selection={select(EntityType.IpfsProtocol, {
			scope: 'IpfsProtocol',
		})}
	/>
</Page>
