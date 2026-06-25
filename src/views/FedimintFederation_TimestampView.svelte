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
		'$federation',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$federation',
				'timestampMs',
				'source',
				{
					label: 'reachability',
				},
				'health',
			],
			[
				'gatewayCount',
				{
					label: 'config hash',
				},
				'moduleConfigHash',
				{
					label: 'meta presence',
				},
				{
					label: 'invite-code observation flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Federation',
				items: [
					{
						label: 'parent Fedimint federation',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					'peerStatusJson',
				],
			},
			{
				label: 'Meta',
				items: [
					'metaJson',
				],
			},
			{
				label: 'Gateways',
				items: [
					'gatewayCount',
					{
						label: 'discovered gateway refs',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'connected client/gateway endpoint',
					},
					{
						label: 'invite-code preview context',
					},
					{
						label: 'errors',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintFederation_Timestamp>
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
	entityType={EntityType.FedimintFederation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
