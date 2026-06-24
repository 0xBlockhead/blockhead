<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'protocolName',
		'registryLabel',
	],
	content: {
		dl: [
			[
				'protocolName',
				'registryLabel',
				'topology',
				'homeUrl',
				'docsUrl',
				'$$xmtpConversations',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Conversations',
				items: [
					'$$xmtpConversations',
				],
			},
			{
				label: 'Demo accounts',
				items: [
					{
						slot: 'DemoAccounts',
						label: 'Generic EVM actor examples',
					},
				],
			},
			{
				label: 'Source coverage',
				items: [
					{
						label: 'Constants and local catalog state',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XmtpNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.XmtpNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
