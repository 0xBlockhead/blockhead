<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<svelte:head>
	<title>XMTP conversations • Blockhead</title>
</svelte:head>


<Page>
	<XmtpConversationsView
		href={resolve('/(social)/(xmtp)/xmtp/conversations')}
		title='XMTP conversations'
		selection={
			select(EntityType.XmtpNetwork, {
				scope: 'XmtpNetwork',
			})[EntityProxyField]<EntityType.XmtpConversation>('$$xmtpConversations', {
				sources: [
					Source.Local_Internal,
				],
			})
		}
		id='xmtp-conversations'
	/>
</Page>
